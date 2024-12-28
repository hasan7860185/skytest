-- Database Schema Export
-- Generated on: 2024

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create Tables
CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    full_name text,
    role text DEFAULT 'employee'::text,
    status text DEFAULT 'active'::text,
    avatar text,
    company_id uuid REFERENCES public.companies(id),
    is_enabled boolean DEFAULT true,
    is_super_admin boolean DEFAULT false,
    notification_settings jsonb DEFAULT '{"email": false, "sound": false, "enabled": false}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    subscription_id uuid REFERENCES public.subscriptions(id),
    PRIMARY KEY (id)
);

CREATE TABLE public.clients (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    status text DEFAULT 'new'::text,
    phone text NOT NULL,
    country text NOT NULL,
    email text,
    city text,
    project text,
    budget text,
    sales_person text,
    contact_method text NOT NULL,
    facebook text,
    campaign text,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    assigned_to uuid REFERENCES auth.users(id),
    rating integer DEFAULT 0,
    next_action_date timestamp with time zone,
    next_action_type text,
    comments text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.tasks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    due_date timestamp with time zone,
    status text DEFAULT 'pending'::text,
    priority text DEFAULT 'medium'::text,
    reminder_date timestamp with time zone,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    assigned_to uuid REFERENCES public.profiles(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.companies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    logo text,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    is_subscription_company boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    engineering_consultant text NOT NULL,
    operating_company text NOT NULL,
    location text,
    delivery_date timestamp with time zone,
    price_per_meter numeric,
    available_units integer,
    unit_price numeric,
    min_area numeric,
    rental_system text,
    images text[],
    company_id uuid REFERENCES public.companies(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.properties (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    type text,
    area text,
    location text,
    price text,
    owner_phone text,
    operating_company text,
    images text[],
    user_id uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid REFERENCES public.companies(id),
    company_name text NOT NULL,
    max_users integer DEFAULT 5,
    start_date timestamp with time zone DEFAULT now(),
    end_date timestamp with time zone NOT NULL,
    is_active boolean DEFAULT true,
    path_segment text,
    admin_email text,
    admin_password text,
    subdomain text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    status,
    company_id,
    is_enabled,
    is_super_admin
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
    'active',
    NULL,
    true,
    false
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_subscription_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NEW.end_date < NOW() THEN
        NEW.is_active := false;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_user_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_count INTEGER;
    max_users INTEGER;
BEGIN
    SELECT s.max_users
    INTO max_users
    FROM public.subscriptions s
    WHERE s.company_id = NEW.company_id
    AND s.is_active = true
    AND s.end_date > NOW()
    LIMIT 1;

    SELECT COUNT(*)
    INTO current_user_count
    FROM public.profiles p
    WHERE p.company_id = NEW.company_id;

    IF current_user_count >= max_users THEN
        RAISE EXCEPTION 'Cannot add more users. Subscription limit reached.';
    END IF;

    RETURN NEW;
END;
$$;

-- Create Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER check_subscription_status_trigger
    BEFORE INSERT OR UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.check_subscription_status();

CREATE TRIGGER check_user_limit_trigger
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.check_user_limit();

-- Create Policies
-- Profiles Policies
CREATE POLICY "profiles_read" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR 
        is_admin(auth.uid()) OR 
        (get_user_company_id(auth.uid()) = company_id)
    );

CREATE POLICY "profiles_insert" ON public.profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_update_admin" ON public.profiles
    FOR UPDATE USING (
        is_admin(auth.uid()) AND 
        (is_super_admin(auth.uid()) OR get_user_company_id(auth.uid()) = company_id)
    );

-- Clients Policies
CREATE POLICY "view_clients" ON public.clients
    FOR SELECT USING (
        user_id = auth.uid() OR 
        assigned_to = auth.uid() OR
        (is_admin(auth.uid()) AND get_user_company_id(auth.uid()) = (
            SELECT company_id FROM profiles WHERE id = clients.user_id
        ))
    );

CREATE POLICY "manage_clients" ON public.clients
    FOR ALL USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'supervisor')
        )
    );

-- Companies Policies
CREATE POLICY "users_can_view_companies" ON public.companies
    FOR SELECT USING (true);

CREATE POLICY "users_can_manage_own_companies" ON public.companies
    FOR ALL USING (user_id = auth.uid());

-- Projects Policies
CREATE POLICY "users_can_view_all_projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "users_can_manage_company_projects" ON public.projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM companies
            WHERE companies.id = projects.company_id
            AND companies.user_id = auth.uid()
        )
    );

-- Subscriptions Policies
CREATE POLICY "super_admins_full_access" ON public.subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_super_admin = true
        )
    );

CREATE POLICY "company_users_view_own" ON public.subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.company_id = subscriptions.company_id
        )
    );

-- Tasks Policies
CREATE POLICY "view_tasks_policy" ON public.tasks
    FOR SELECT USING (
        created_by = auth.uid() OR
        assigned_to = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'supervisor')
        )
    );

CREATE POLICY "manage_own_tasks" ON public.tasks
    FOR ALL USING (created_by = auth.uid());

-- Properties Policies
CREATE POLICY "view_all_properties" ON public.properties
    FOR SELECT USING (true);

CREATE POLICY "manage_own_properties" ON public.properties
    FOR ALL USING (user_id = auth.uid());