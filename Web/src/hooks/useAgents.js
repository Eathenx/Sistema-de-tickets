import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getInitials } from "../utils/ticketUtils";

export function useAgents() {
  const [agents, setAgents] = useState([]);
  useEffect(() => {
    supabase
      .from("Usuarios")
      .select("id, Usuario")
      .eq("Rol", "agente")
      .then(({ data }) => {
        setAgents((data ?? []).map(u => ({
          id:       String(u.id),
          name:     u.Usuario,
          initials: getInitials(u.Usuario),
        })));
      });
  }, []);
  return agents;
}
