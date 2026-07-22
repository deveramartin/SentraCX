import { Conversations } from "@/components/features/conversations/Conversations";

interface ConversationsPageProps {
  searchParams: Promise<{ ticketId?: string }>;
}

export default async function ConversationsPage({ searchParams }: ConversationsPageProps) {
  const { ticketId } = await searchParams;
  return <Conversations initialTicketId={ticketId} />;
}
