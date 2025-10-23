// DENTRO DE: src/components/AudiogramChart.jsx

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VIVID_RED = 'rgb(220, 38, 38)';
const VIVID_BLUE = 'rgb(37, 99, 235)';

// Mantivemos nossa lista de frequências mais completa
const LABELS = ['','250', '500', '750', '1k', '1.5k', '2k', '3k', '4k', '6k', '8k'];

// NOVO: Função para criar símbolos com <canvas> (do seu código base)
const createSymbol = (type, color) => {
  const symbol = document.createElement('canvas');
  const ctx = symbol.getContext('2d');
  symbol.width = 14;
  symbol.height = 14;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5; // Aumentei um pouco a espessura para melhor visibilidade
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (type) {
    case 'O':
      ctx.beginPath();
      ctx.arc(7, 7, 5, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    case 'X':
      ctx.beginPath();
      ctx.moveTo(2, 2);
      ctx.lineTo(12, 12);
      ctx.moveTo(12, 2);
      ctx.lineTo(2, 12);
      ctx.stroke();
      break;
    case '<':
      ctx.beginPath();
      ctx.moveTo(10, 2);
      ctx.lineTo(4, 7);
      ctx.lineTo(10, 12);
      ctx.stroke();
      break;
    case '>':
      ctx.beginPath();
      ctx.moveTo(4, 2);
      ctx.lineTo(10, 7);
      ctx.lineTo(4, 12);
      ctx.stroke();
      break;
    default:
      break;
  }
  return symbol;
};

// REMOVIDO: O código antigo que criava os símbolos com SVG não é mais necessário.

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { title: { display: true, text: 'Frequência (Hz)' } },
    y: {
      reverse: true,
      min: -20,
      max: 120,
      title: { display: true, text: 'Nível de Audição (dBNA)' },
      ticks: { stepSize: 10, padding: 10 },
    },
  },
};

export default function AudiogramChart({ odAirData, oeAirData, odBoneData, oeBoneData }) {

  const odChartData = {
    labels: LABELS,
    datasets: [
      {
        label: 'Orelha Direita (Aérea)',
        data: odAirData,
        borderColor: VIVID_RED,
        // ATUALIZADO: Usa a nova função para criar o símbolo 'O'
        pointStyle: createSymbol('O', VIVID_RED),
        spanGaps: true,
        fill: false,
        backgroundColor: `rgba(220, 38, 38, 0.5)`, pointRadius: 10,
      },
      {
        label: 'Orelha Direita (Óssea)',
        data: odBoneData,
        borderColor: VIVID_RED,
        // ATUALIZADO: Usa a nova função para criar o símbolo '<'
        pointStyle: createSymbol('<', VIVID_RED),
        showLine: false,
        fill: false,
        backgroundColor: `rgba(220, 38, 38, 0.5)`, pointRadius: 10,
      },
    ],
  };

  const oeChartData = {
    labels: LABELS,
    datasets: [
      {
        label: 'Orelha Esquerda (Aérea)',
        data: oeAirData,
        borderColor: VIVID_BLUE,
        // ATUALIZADO: Usa a nova função para criar o símbolo 'X'
        pointStyle: createSymbol('X', VIVID_BLUE),
        spanGaps: true,
        borderDash: [5, 5],
        fill: false,
        backgroundColor: `rgba(37, 99, 235, 0.5)`, pointRadius: 10,
      },
      {
        label: 'Orelha Esquerda (Óssea)',
        data: oeBoneData,
        borderColor: VIVID_BLUE,
        // ATUALIZADO: Usa a nova função para criar o símbolo '>'
        pointStyle: createSymbol('>', VIVID_BLUE),
        showLine: false,
        fill: false,
        backgroundColor: `rgba(37, 99, 235, 0.5)`, pointRadius: 10,
      },
    ],
  };

  const odChartOptions = { ...baseOptions, plugins: { ...baseOptions.plugins, title: { display: true, text: 'OD' } } };
  const oeChartOptions = { ...baseOptions, plugins: { ...baseOptions.plugins, title: { display: true, text: 'OE' } } };

  // O layout de dois gráficos com Tailwind CSS foi mantido
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div style={{ height: '400px' }}>
        <Line options={odChartOptions} data={odChartData} />
      </div>
      <div style={{ height: '400px' }}>
        <Line options={oeChartOptions} data={oeChartData} />
      </div>
    </div>
  );
}