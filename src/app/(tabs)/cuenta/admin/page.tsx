import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import {
  InformeView,
  type CuentaInforme,
  type Informe,
} from "@/components/admin/informe-view";
import { conAdmin, crearClienteAdmin } from "@/lib/supabase/admin";
import { sumarMes } from "@/lib/mes";
import type { ColorBloque } from "@/lib/tipos";

// Informe de admin: cómo va la app. Conteos y actividad por cuenta — el RLS
// de los usuarios queda intacto; acá se lee con el cliente de servicio.
export default async function AdminPage() {
  await conAdmin();

  // Sin la secret key no hay informe: avisar en pantalla (solo el admin llega aquí)
  if (!process.env.SUPABASE_SECRET_KEY) {
    return (
      <>
        <PageHeader
          title={<Link href="/cuenta">‹ Informe</Link>}
          derecha={
            <span className="text-xs font-bold text-muted-foreground">
              solo admin
            </span>
          }
        />
        <div className="nbs px-3.5 py-4 text-center">
          <div className="text-[26px]">🔑</div>
          <b className="mt-1 block text-[13.5px] font-black">
            Falta configurar la llave
          </b>
          <p className="mt-1 text-[11.5px] font-bold text-muted-foreground">
            Agrega <code className="font-black">SUPABASE_SECRET_KEY</code> en
            .env.local y en Vercel (Dashboard de Supabase → Settings → API Keys
            → secret key).
          </p>
        </div>
      </>
    );
  }

  const admin = crearClienteAdmin();
  const [usuarios, perfiles, movs, metas, apartados, medios, frecuentes] =
    await Promise.all([
      admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      admin
        .from("profiles")
        .select("id, nombre, inicial, color, avatar_url, created_at"),
      admin.from("movimientos").select("user_id, fecha"), // solo lo mínimo: el informe cuenta, no espía montos
      admin.from("metas").select("user_id"),
      admin.from("apartados").select("user_id"),
      admin.from("medios").select("user_id"),
      admin.from("frecuentes").select("user_id"),
    ]);
  // todos nacen con 2 medios base (trigger de seed.sql): los frecuentes sí dicen quién entendió la app
  const conFrecuentes = new Set((frecuentes.data ?? []).map((f) => f.user_id));

  const hoy = new Date();
  const mesActual = hoy.toISOString().slice(0, 7);
  const hace7 = new Date(hoy.getTime() - 7 * 86400000)
    .toISOString()
    .slice(0, 10);
  const adminId = process.env.ADMIN_USER_ID;

  // resumen por usuario a partir de las filas crudas
  type Resumen = {
    movs: number;
    ultimoMov: string | null;
    metas: number;
    apartados: number;
    medios: number;
  };
  const resumen = new Map<string, Resumen>();
  const de = (id: string) => {
    let r = resumen.get(id);
    if (!r)
      resumen.set(
        id,
        (r = { movs: 0, ultimoMov: null, metas: 0, apartados: 0, medios: 0 }),
      );
    return r;
  };
  let movsMes = 0;
  for (const m of movs.data ?? []) {
    const r = de(m.user_id);
    r.movs += 1;
    if (!r.ultimoMov || m.fecha > r.ultimoMov) r.ultimoMov = m.fecha;
    if (m.fecha.slice(0, 7) === mesActual) movsMes += 1;
  }
  for (const m of metas.data ?? []) de(m.user_id).metas += 1;
  for (const a of apartados.data ?? []) de(a.user_id).apartados += 1;
  for (const m of medios.data ?? []) de(m.user_id).medios += 1;

  // el perfil manda (nombre, color, alta); el correo vive en Auth
  const correos = new Map(
    (usuarios.data?.users ?? []).map((u) => [u.id, u.email ?? ""]),
  );
  // el orden lo elige el cliente en CuentasLista (recientes | más uso)
  const cuentas: CuentaInforme[] = (perfiles.data ?? []).map(
    (p): CuentaInforme => {
      const r = resumen.get(p.id);
      return {
        id: p.id,
        nombre: p.nombre,
        inicial: p.inicial,
        color: p.color as ColorBloque,
        avatarUrl: p.avatar_url ?? null,
        email: correos.get(p.id) ?? "",
        desde: p.created_at.slice(0, 10),
        movs: r?.movs ?? 0,
        ultimoMov: r?.ultimoMov ?? null,
        metas: r?.metas ?? 0,
        apartados: r?.apartados ?? 0,
        medios: r?.medios ?? 0,
        esAdmin: p.id === adminId,
      };
    },
  );

  // últimos 6 meses con el actual al final
  const altasPorMes = Array.from({ length: 6 }, (_, i) =>
    sumarMes(mesActual, i - 5),
  ).map((mes) => ({
    mes,
    n: cuentas.filter((c) => c.desde.slice(0, 7) === mes).length,
  }));

  const informe: Informe = {
    cuentas,
    totales: {
      cuentas: cuentas.length,
      altasMes: altasPorMes[5].n,
      activas7: cuentas.filter(
        (c) => c.ultimoMov !== null && c.ultimoMov >= hace7,
      ).length,
      movs: (movs.data ?? []).length,
      movsMes,
      metas: (metas.data ?? []).length,
      apartados: (apartados.data ?? []).length,
    },
    adopcion: [
      {
        etiqueta: "Registran movimientos",
        n: cuentas.filter((c) => c.movs > 0).length,
      },
      { etiqueta: "Usan metas", n: cuentas.filter((c) => c.metas > 0).length },
      {
        etiqueta: "Usan apartados",
        n: cuentas.filter((c) => c.apartados > 0).length,
      },
      {
        etiqueta: "Crearon frecuentes",
        n: cuentas.filter((c) => conFrecuentes.has(c.id)).length,
      },
      {
        etiqueta: "Foto de perfil",
        n: cuentas.filter((c) => c.avatarUrl !== null).length,
      },
    ],
    altasPorMes,
  };

  return <InformeView informe={informe} />;
}
