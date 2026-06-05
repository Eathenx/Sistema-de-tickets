import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { TicketTable } from "../components/tickets/TicketTable";

export function TicketsView({ filteredTickets, filter, setFilter, onOpenTicket, loading, error, onRetry }) {
  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorBanner message={error} onRetry={onRetry} />;
  return (
    <TicketTable
      tickets={filteredTickets}
      filter={filter}
      setFilter={setFilter}
      onOpenTicket={onOpenTicket}
    />
  );
}
