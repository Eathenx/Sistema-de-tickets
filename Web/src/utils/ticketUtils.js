export function getInitials(name = "") {
  return (name || "").trim().split(/\s+/).map(w => w[0]?.toUpperCase() ?? "").slice(0, 2).join("") || "?";
}

export function mapDbTicket(row, incMap, usrMap) {
  const inc = incMap[row.Incidente_ID] ?? {};
  const usr = usrMap[row.Usuario]      ?? {};
  return {
    _id:               row.id,
    id:                `TK-${String(row.id).padStart(4, "0")}`,
    title:             inc.Incidente   ?? row.Descripcion?.slice(0, 60) ?? "Sin título",
    category:          inc.Categoria   ?? row.Departamento ?? "—",
    requester:         usr.Usuario     ?? `Usuario #${row.Usuario ?? "?"}`,
    requesterInitials: getInitials(usr.Usuario),
    agent:             row.Agente      ?? "Sin asignar",
    agentInitials:     getInitials(row.Agente),
    status:            row.Status      ?? "open",
    priority:          row.Prioridad   ?? "medium",
    created:           row.Fecha ? new Date(row.Fecha).toLocaleDateString("es-ES") : "—",
    desc:              row.Descripcion  ?? "",
    departamento:      row.Departamento ?? "",
    incidenteTiempo:   inc.Tiempo       ?? "",
  };
}
