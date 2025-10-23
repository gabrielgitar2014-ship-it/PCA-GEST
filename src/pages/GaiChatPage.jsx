// src/pages/GaiChatPage.jsx
import GaiChatCore from '@/components/GaiChatCore';

export default function GaiChatPage() {
  // O componente GaiChatCore ocupa a página inteira
  // Passamos isPage={true} para que ele mostre o header e o botão de minimizar
  return (
    <div className="h-[calc(100vh-theme(spacing.16))]"> {/* Ajusta altura para ocupar espaço abaixo do Header */}
      <GaiChatCore isPage={true} />
    </div>
  );
}