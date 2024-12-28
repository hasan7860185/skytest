import { Users, Star, ThumbsUp, MessageCircle, XCircle, Calendar, UserCheck, CheckCircle, XOctagon, DollarSign, Clock, RefreshCcw, Facebook, MessageSquare, Building, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ClientStatus {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const staticClientStatuses: ClientStatus[] = [
  { key: "new", label: "status.new", icon: Users },
  { key: "potential", label: "status.potential", icon: Star },
  { key: "interested", label: "status.interested", icon: ThumbsUp },
  { key: "responded", label: "status.responded", icon: MessageCircle },
  { key: "noResponse", label: "status.noResponse", icon: XCircle },
  { key: "scheduled", label: "status.scheduled", icon: Calendar },
  { key: "postMeeting", label: "status.postMeeting", icon: UserCheck },
  { key: "whatsappContact", label: "status.whatsappContact", icon: MessageSquare },
  { key: "facebookContact", label: "status.facebookContact", icon: Facebook },
  { key: "booked", label: "status.booked", icon: CheckCircle },
  { key: "cancelled", label: "status.cancelled", icon: XOctagon },
  { key: "sold", label: "status.sold", icon: DollarSign },
  { key: "postponed", label: "status.postponed", icon: Clock },
  { key: "resale", label: "status.resale", icon: RefreshCcw },
  { key: "interestedNAC", label: "status.interestedNAC", icon: Building },
  { key: "interestedTagamoa", label: "status.interestedTagamoa", icon: Building },
  { key: "interestedMustakbal", label: "status.interestedMustakbal", icon: Building },
  { key: "interestedNorthCoast", label: "status.interestedNorthCoast", icon: MapPin },
  { key: "interestedZayed", label: "status.interestedZayed", icon: Building },
  { key: "interestedOctober", label: "status.interestedOctober", icon: Building },
  { key: "interestedSokhna", label: "status.interestedSokhna", icon: MapPin },
  { key: "interestedShorouk", label: "status.interestedShorouk", icon: Building },
  { key: "interestedObour", label: "status.interestedObour", icon: Building },
  { key: "interestedHeliopolis", label: "status.interestedHeliopolis", icon: Building },
];

export const useClientStatuses = () => {
  return [
    { key: "all", label: "status.all", icon: Users },
    ...staticClientStatuses
  ];
};