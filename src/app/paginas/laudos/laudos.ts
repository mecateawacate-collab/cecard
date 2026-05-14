import { Component } from '@angular/core';

interface Expediente {
  nombre: string;
  archivo: string;
}

@Component({
  selector: 'app-laudos',
  imports: [],
  templateUrl: './laudos.html',
  styleUrl: './laudos.css',
})
export class Laudos {
  anios: number[] = [2022, 2023, 2024, 2025, 2026];

  anioSeleccionado: number = 2022;

expedientesPorAnio: Record<number, Expediente[]> = {
  2022: [
    { nombre: 'EXP. NRO. 01-2022-MEVGP', archivo: 'laudos/documentos/2022/1. EXP. NRO. 01-2022-MEVGP- CECARD.pdf' },
    { nombre: 'EXP. NRO. 02-2022-MHBF', archivo: 'laudos/documentos/2022/2. EXP. NRO. 02-2022-MHBF- CECARD.pdf' },
    { nombre: 'EXP. NRO. 02-2022-RECURSO POST LAUDO', archivo: 'laudos/documentos/2022/2.1 EXP. NRO. 02-2022- RECURSO POST LAUDO.pdf' },
    { nombre: 'EXP. NRO. 03-2022-JALR-CECARD', archivo: 'laudos/documentos/2022/3. EXP. NRO. 03-2022-JALR- CECARD.pdf' },
    { nombre: 'EXP. NRO. 04-2022-RAFC-CECARD-ARBITRAJE DE EMERGENCIA', archivo: 'laudos/documentos/2022/4. EXP. NRO. 04-2022- RAFC- CECARD -ARBITRAJE DE EMERGENCIA.pdf' },
    { nombre: 'EXP. NRO. 05-2022-MAPA-CECARD', archivo: 'laudos/documentos/2022/5. EXP. NRO. 05-2022-MAPA- CECARD.pdf' },
    { nombre: 'EXP. NRO. 06-2022-PMGR-CECARD', archivo: 'laudos/documentos/2022/6. EXP. NRO. 06-2022- PMGR-CECARD.pdf' },
    { nombre: 'EXP. NRO. 10-2022-DTD-CECARD-ARBITRAJE DE EMERGENCIA', archivo: 'laudos/documentos/2022/7. EXP. NRO. 10-2022-DTD- CECARD - ARBITRAJE DE EMERGENCIA.pdf' },
    { nombre: 'EXP. NRO. 12-2022-PHT-CECARD', archivo: 'laudos/documentos/2022/8. EXP. NRO. 12-2022- PHT-CECARD.pdf' },
    { nombre: 'EXP. NRO. 12-2022-RECURSO POST LAUDO', archivo: 'laudos/documentos/2022/8.1 EXP. NRO. 12-2022- RECURSO POST LAUDO.pdf' },
    { nombre: 'EXP. NRO. 13-2022-MEVGP-CECARD', archivo: 'laudos/documentos/2022/9. EXP. NRO. 13-2022-MEVGP-CECARD.pdf' },
    { nombre: 'EXP. NRO. 14-2022-CCGC-CECARD-ARBITRAJE ACELERADO', archivo: 'laudos/documentos/2022/10. EXP. NRO. 14-2022-CCGC-CECARD- ARBITRAJE ACELERADO.pdf' },
    { nombre: 'EXP. NRO. 17-2022-LPG-CECARD-ARBITRAJE DE EMERGENCIA', archivo: 'laudos/documentos/2022/11. EXP. NRO. 17-2022-LPG- CECARD - ARBITRAJE DE EMERGENCIA.pdf' },
    { nombre: 'EXP. NRO. 18-2022-JAQS-CECARD', archivo: 'laudos/documentos/2022/12. EXP. NRO. 18-2022-JAQS-CECARD.pdf' },
    { nombre: 'EXP. NRO. 19-2022-JMFC-CECARD', archivo: 'laudos/documentos/2022/13. EXP. NRO. 19-2022 - JMFC- CECARD.pdf' },
    { nombre: 'EXP. NRO. 19-2022-RECURSO POST LAUDO', archivo: 'laudos/documentos/2022/13. EXP. NRO. 19-2022- RECURSO POST LAUDO.pdf' },
    { nombre: 'EXP. NRO. 20-2022-JRR-CECARD', archivo: 'laudos/documentos/2022/14. EXP. NRO. 20-2022 - JRRR- CECARD.pdf' },
    { nombre: 'EXP. NRO. 21-2022-DTD-CECARD- ARBITRAJE DE EMERGENCIA', archivo: 'laudos/documentos/2022/15. EXP. NRO. 21-2022-DTD- CECARD - ARBITRAJE DE EMERGENCIA.pdf' },
    { nombre: 'EXP. NRO. 22-2022-DTD-CECARD', archivo: 'laudos/documentos/2022/17. EXP. NRO. 22-2022 - DTD - CECARD.pdf' },
    { nombre: 'EXP. NRO. 22-2022-RECURSO POST LAUDO-CECARD', archivo: 'laudos/documentos/2022/17.1 EXP. NRO. 22 -2022 RECURSO POST LAUDO.pdf' },
    { nombre: 'EXP. NRO. 23-2022-MHBF-CECARD', archivo: 'laudos/documentos/2022/18. EXP. NRO. 23-2022- MHBF-CECARD.pdf' },
    { nombre: 'EXP. NRO. 23-2022-RECURSO POST LAUDO', archivo: 'laudos/documentos/2022/18.1 EXP. NRO. 23-2022- RECURSO POST LAUDO.pdf' },
    { nombre: 'EXP. NRO. 24-2022-CEAS-CECARD-ARBITRAJE DE EMERGENCIA', archivo: 'laudos/documentos/2022/19. EXP. NRO. 24-2022-CEAS- CECARD - ARBITRAJE DE EMERGENCIA.pdf' }
  ],

  2023: [
    { nombre: 'EXP. NRO. 01-2023-MDCPO-CECARD', archivo: 'laudos/documentos/2023/1. EXP. NRO. 01-2023 - MDCPO- CECARD.pdf' },
    { nombre: 'EXP. NRO. 01-2023-RECURSO POST LAUDO', archivo: 'laudos/documentos/2023/1.1 EXP. NRO. 01-2023 - RECURSO POST LAUDO.pdf' },
    { nombre: 'EXP. NRO. 05-2023-MAMZ-CECARD', archivo: 'laudos/documentos/2023/2. EXP. NRO. 05-2023 - MAMZ - CECARD.pdf' },
    { nombre: 'EXP. NRO. 05-2023-RECURSO POST LAUDO', archivo: 'laudos/documentos/2023/2. EXP. NRO. 05-2023 - RECURSO POST LAUDO.pdf' },
    { nombre: 'EXP. NRO. 06-2023 - CYAM - CECARD- LAUDO PARCIAL', archivo: 'laudos/documentos/2023/3. EXP. NRO. 06-2023 - CYAM - CECARD- LAUDO PARCIAL.pdf' },
    { nombre: 'EXP. NRO. 06-2023 - CYAM - CECARD', archivo: 'laudos/documentos/2023/3.1 EXP. NRO. 06-2023 - CYAM - CECARD.pdf' },
    { nombre: 'EXP. NRO. 06-2023- RECURSO POST LAUDO', archivo: 'laudos/documentos/2023/3.2 EXP. NRO. 06-2023- RECURSO POST LAUDO.pdf' },
    { nombre: 'EXP. NRO. 08-2023-CEAS-ARBITRAJE DE EMERGENCIA', archivo: 'laudos/documentos/2023/4. EXP. NRO. 08-2023 - CEAS- ARBITRAJE DE EMERGENCIA.pdf' },
    { nombre: 'EXP. NRO. 09-2023-LPG-ARBITRAJE DE EMERGENCIA', archivo: 'laudos/documentos/2023/5. EXP. NRO. 09-2023 - LPG- ARBITRAJE DE EMERGENCIA.pdf' },
    { nombre: 'EXP. NRO. 12-2023-AMZ-CECARD', archivo: 'laudos/documentos/2023/6. EXP. NRO. 12-2023 - AMZ -CECARD.pdf' },
    { nombre: 'EXP. NRO. 17-2023 - CCGC - CECARD - LAUDO PARCIAL', archivo: 'laudos/documentos/2023/7. EXP. NRO. 17-2023 - CCGC -CECARD - LAUDO PARCIAL.pdf' },
    { nombre: 'EXP. NRO. 17-2023 - CCGC - CECARD', archivo: 'laudos/documentos/2023/7.1 EXP. NRO. 17-2023 - CCGC -CECARD.pdf' },
    { nombre: 'EXP. NRO. 21-2023 - SEQ - CECARD - LAUDO PARCIAL', archivo: 'laudos/documentos/2023/8. EXP. NRO. 21-2023 - SEQ - CECARD - LAUDO PARCIAL.pdf' },
    { nombre: 'EXP. NRO. 21-2023 - SEQ - CECARD', archivo: 'laudos/documentos/2023/8.1. EXP. NRO. 21-2023 - SEQ - CECARD.pdf' },
    { nombre: 'EXP. NRO. 24-2023-RAFC-CECARD', archivo: 'laudos/documentos/2023/9. EXP. NRO. 24-2023 - RAFC- CECARD.pdf' }
  ],

  2024: [
    { nombre: 'EXP. NRO. 01-2024-CYAM-ARBITRAJE DE EMERGENCIA', archivo: 'laudos/documentos/2024/1. EXP. NRO. 01-2024-CYAM- ARBITRAJE DE EMERGENCIA.pdf' },
    { nombre: 'EXP. NRO. 04-2024-APS-CECARD - LAUDO PARCIAL', archivo: 'laudos/documentos/2024/2. EXP. NRO. 04-2024-APS-CECARD - LAUDO PARCIAL.pdf' },
    { nombre: 'EXP. NRO. 04-2024-APS-CECARD', archivo: 'laudos/documentos/2024/2. EXP. NRO. 04-2024-APS-CECARD.pdf' },
    { nombre: 'EXP. NRO. 07-2024-JCPE-CECARD', archivo: 'laudos/documentos/2024/3. EXP. NRO. 07-2024-JCPE-CECARD.pdf' },
    { nombre: 'EXP. NRO. 08-2024-JWCC-CECARD', archivo: 'laudos/documentos/2024/4. EXP. NRO. 08-2024-JWCC-CECARD.pdf' },
    { nombre: 'EXP. NRO. 08-2024-JWCC-RECURSO POST LAUDO', archivo: 'laudos/documentos/2024/4.1 EXP. NRO. 08-2024-JWCC- RECURSO POST LAUDO.pdf' },
    { nombre: 'EXP. NRO. 09-2024-MAMZ-CECARD', archivo: 'laudos/documentos/2024/5 EXP. NRO. 09-2024-MAMZ- CECARD.pdf' },
    { nombre: 'EXP. NRO. 10-2024-LPG-CECARD - LAUDO PARCIAL', archivo: 'laudos/documentos/2024/6. EXP. NRO. 10-2024-LPG-CECARD - LAUDO PARCIAL.pdf' },
    { nombre: 'EXP. NRO. 10-2024-LPG-CECARD', archivo: 'laudos/documentos/2024/6.1 EXP. NRO. 10-2024-LPG-CECARD.pdf' },
    { nombre: 'EXP. NRO. 11-2024-JMFC-CECARD', archivo: 'laudos/documentos/2024/6 EXP. NRO. 11-2024-JMFC- CECARD.pdf' },
    { nombre: 'EXP. NRO. 11-2024-RECURSO POST LAUDO', archivo: 'laudos/documentos/2024/6.1 EXP. NRO. 11-2024-RECURSO POST LAUDO.pdf' },
    { nombre: 'EXP. NRO. 12-2024-KMM-CECARD - LAUDO PARCIAL', archivo: 'laudos/documentos/2024/8. EXP. NRO. 12-2024-KMM-CECARD - LAUDO PARCIAL.pdf' },
    { nombre: 'EXP. NRO. 12-2024-KMM-CECARD', archivo: 'laudos/documentos/2024/8.1 EXP. NRO. 12-2024-KMM-CECARD.pdf' },
    { nombre: 'EXP. NRO. 12-2024-KMM-CECARD - RECTIFICACION DE OFICIO', archivo: 'laudos/documentos/2024/8.2 EXP. NRO. 12-2024-KMM-CECARD- RRECTIFICACION DE OFICIO.pdf' },
    { nombre: 'EXP. NRO. 13-2024-MAPA-CECARD', archivo: 'laudos/documentos/2024/7. EXP. NRO. 13-2024 - MAPA - CECARD.pdf' },
    { nombre: 'EXP. NRO. 13-2024-MAPA-CECARD-RECURSO POST LAUDO', archivo: 'laudos/documentos/2024/7.1 EXP. 13-2024 - MAPA - RECURSO POST LAUDO.pdf' },
    { nombre: 'EXP. NRO. 20-2024-ACVDC-ARBITRAJE DE EMERGENCIA', archivo: 'laudos/documentos/2024/8 EXP. NRO. 20-2024-ACVDC- ARBITRAJE DE EMERGENCIA.pdf' }
  ],

  2025: [
    { nombre: 'EXP. NRO. 04-2025-CCGC-CECARD', archivo: 'laudos/documentos/2025/1. EXP. 04-2025-CCGC-CECARD.pdf' },
    { nombre: 'EXP. NRO. 07-2025-MHBF-CECARD', archivo: 'laudos/documentos/2025/2. EXP. 07-2025-MHBF-CECARD.pdf' },
    { nombre: 'EXP. NRO. 11-2025-SEQ-ARBITRAJE DE EMERGENCIA', archivo: 'laudos/documentos/2025/1. EXP. NRO. 11-2025-SEQ- ARBITRAJE DE EMERGENCIA.pdf' }
  ],

  2026: []
};

  get expedientesSeleccionados(): Expediente[] {
    return this.expedientesPorAnio[this.anioSeleccionado] ?? [];
  }

  seleccionarAnio(anio: number): void {
    this.anioSeleccionado = anio;
  }
}