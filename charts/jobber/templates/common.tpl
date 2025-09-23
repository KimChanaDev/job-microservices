{{- define "common.env" -}}
- name: NODE_ENV
  value: {{ .Values.global.nodeEnv }}
- name: PULSAR_SERVICE_URL
  value: pulsar://{{ .Release.Name }}-pulsar-broker.pulsar.svc.cluster.local:6650
{{- end -}}