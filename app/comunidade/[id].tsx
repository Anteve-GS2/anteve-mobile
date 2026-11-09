import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { LineChart } from "@/components/LineChart";
import { Loader } from "@/components/Loader";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { getPainel } from "@/services/mapa";
import { EstadoRisco } from "@/types/mapa";
import { estadoPorIndice, formatarDias, normalizarEstado } from "@/utils/risk";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {!!hint && <Text style={styles.label}>{hint}</Text>}
    </Card>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.errorState}>
      <Text style={styles.text}>{message}</Text>
      <Pressable onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

export default function Detalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: p,
    loading,
    error,
    reload,
  } = useAsync(() => getPainel(id), [id]);

  if (loading && !p) return <Loader />;
  if (error || !p)
    return <ErrorState message={error || "Sem dados."} onRetry={reload} />;

  const estado: EstadoRisco =
    normalizarEstado(p.estado, p.indice ?? 0) ?? estadoPorIndice(p.indice ?? 0);
  const niveis = (p.historico ?? []).map((h) => h.nivel);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={p.nome ?? "Comunidade"}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Badge estado={estado} />
        <View style={styles.row}>
          <Metric
            label="Nível atual"
            value={p.nivelAtual !== undefined ? `${p.nivelAtual} m` : "—"}
            hint={
              p.variacaoDiaria !== undefined
                ? `variação de ${p.variacaoDiaria} cm/dia`
                : undefined
            }
          />
          <Metric label="Isolamento em" value={formatarDias(p.diasPrevistos)} />
        </View>
        <View style={styles.row}>
          <Metric
            label="Vulneráveis"
            value={String(p.vulneraveis ?? "—")}
            hint="gestantes, idosos, crianças"
          />
          <Metric
            label="Relatos recentes"
            value={String(p.relatosRecentes?.length ?? 0)}
          />
        </View>

        <Card>
          <Text style={styles.label}>Histórico de nível</Text>
          <LineChart values={niveis} />
        </Card>

        <Card>
          <Text style={styles.label}>Indicadores naturais</Text>
          {(p.indicadores ?? []).length === 0 && (
            <Text style={styles.text}>Nenhum indicador identificado.</Text>
          )}
          {(p.indicadores ?? []).map((i, k) => (
            <Text key={k} style={styles.text}>
              {i.nome}
              {i.acertos !== undefined && i.tentativas
                ? ` · acertou ${i.acertos} de ${i.tentativas}`
                : ""}
            </Text>
          ))}
        </Card>

        <Card>
          <Text style={styles.label}>Relatos recentes</Text>
          {(p.relatosRecentes ?? []).length === 0 && (
            <Text style={styles.text}>Nenhum relato nas últimas 48 h.</Text>
          )}
          {(p.relatosRecentes ?? []).map((r, k) => (
            <Text key={k} style={styles.text}>
              "{r.texto}"{r.data ? ` · ${r.data}` : ""}
            </Text>
          ))}
        </Card>

        <Card>
          <Text style={styles.label}>Necessidades de abastecimento</Text>
          <View style={styles.chips}>
            {(p.necessidades ?? []).length === 0 && (
              <Text style={styles.text}>Sem plano gerado.</Text>
            )}
            {(p.necessidades ?? []).map((n) => (
              <Chip key={n} label={n} />
            ))}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 10, paddingBottom: 32 },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 12,
  },
  retryButton: {
    backgroundColor: colors.teal,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: { color: colors.bg, fontWeight: "700" },
  row: { flexDirection: "row", gap: 10 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  label: { fontSize: 12, color: colors.muted },
  value: { fontSize: 20, fontWeight: "800", color: colors.ink },
  text: { fontSize: 14, color: colors.ink },
});
