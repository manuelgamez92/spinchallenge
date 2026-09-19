import { globalFooterStyles } from "@/src/styles/ui.styles";

const transferScenariosEnabled = process.env.NEXT_PUBLIC_ENABLE_TRANSFER_SCENARIOS !== "false";

export function GlobalFooter() {
  return (
    <footer className={globalFooterStyles.shell}>
      <div className={globalFooterStyles.container}>
        <div className={globalFooterStyles.grid}>
          <div>
            <p className={globalFooterStyles.brand}>Mini Wallet</p>
            <h2 className={globalFooterStyles.title}>Tu dinero, claro y siempre disponible.</h2>
            <p className={globalFooterStyles.description}>
              Monitorea saldo, movimientos y transferencias en una experiencia simple y segura.
              Este entorno usa datos simulados para práctica funcional y validación de flujo.
            </p>
            <div className={globalFooterStyles.metaRow}>
              <span className={globalFooterStyles.chip}>Ambiente: Sandbox Operativo</span>
              <span className={globalFooterStyles.chip}>
                Simulación de escenarios: {transferScenariosEnabled ? "Activa" : "Inactiva"}
              </span>
            </div>
          </div>

          <div className={globalFooterStyles.rightColumn}>
            <p>
              <span className={globalFooterStyles.rightLabel}>Atención Mini Wallet:</span>{" "}
              <span className={globalFooterStyles.rightValue}>soporte@miniwallet.demo</span>
            </p>
            <p>
              <span className={globalFooterStyles.rightLabel}>Línea de ayuda:</span>{" "}
              <span className={globalFooterStyles.rightValue}>+52 55 0000 1234</span>
            </p>
            <p>
              <span className={globalFooterStyles.rightLabel}>Horario de soporte:</span>{" "}
              <span className={globalFooterStyles.rightValue}>Lun - Vie, 08:00 a 20:00 (CDMX)</span>
            </p>
            <p>
              <span className={globalFooterStyles.rightLabel}>Versión:</span>{" "}
              <span className={globalFooterStyles.rightValue}>v1.2.0-sandbox</span>
            </p>
            <p>
              <span className={globalFooterStyles.rightLabel}>Aviso regulatorio:</span>{" "}
              <span className={globalFooterStyles.rightValue}>Demo funcional con datos no productivos.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
