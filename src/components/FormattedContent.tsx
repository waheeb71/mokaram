import React from 'react';
import { Check, Dot } from 'lucide-react';

interface FormattedContentProps {
  text: string;
  className?: string;
  clampLines?: number;
}

/**
 * Formats multi-line plain text with rich formatting:
 * - Lines starting with `•`, `-`, `*`, `✓`, or `✔` become bullet items with stylish gold check/dot icons.
 * - Lines starting with `1.`, `2.`, etc., become numbered items.
 * - Lines starting with `###` become subheadings.
 * - Text inside `**...**` becomes bold.
 * - Text inside `[...]` becomes a badge/pill tag.
 * - Preserves line breaks and paragraphs neatly.
 */
export const FormattedContent: React.FC<FormattedContentProps> = ({
  text,
  className = '',
  clampLines,
}) => {
  if (!text) return null;

  // Helper to parse inline tokens: bold `**bold**`, badge `[tag]`, highlight `==hl==`
  const renderInlineTokens = (str: string) => {
    // Regex matches **bold**, [badge], and ==highlight==
    const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]|==[^=]+==)/g;
    const parts = str.split(regex);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-inherit">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span
            key={i}
            className="inline-block px-2 py-0.5 mx-1 text-[11px] font-semibold bg-[#F4EFE6] text-[#8C6B3A] border border-[#DDD5C5] rounded-md shadow-2xs align-middle"
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      if (part.startsWith('==') && part.endsWith('==')) {
        return (
          <mark
            key={i}
            className="px-1.5 py-0.5 mx-0.5 bg-[#9B7846]/15 text-[#6D4F23] rounded font-medium"
          >
            {part.slice(2, -2)}
          </mark>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  // If clamped, render simple cleaned text with line-clamp
  if (clampLines) {
    const clampClass =
      clampLines === 1
        ? 'line-clamp-1'
        : clampLines === 2
        ? 'line-clamp-2'
        : clampLines === 3
        ? 'line-clamp-3'
        : clampLines === 4
        ? 'line-clamp-4'
        : 'line-clamp-5';

    return (
      <div className={`${clampClass} ${className}`}>
        {text.split('\n').map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          const cleanLine = trimmed.replace(/^([•\-\*✓✔]|\d+\.)\s*/, '');
          return (
            <span key={idx} className="inline">
              {renderInlineTokens(cleanLine)}{' '}
            </span>
          );
        })}
      </div>
    );
  }

  // Split lines into blocks
  const lines = text.split('\n');
  const blocks: {
    type: 'paragraph' | 'bullet' | 'check' | 'numbered' | 'heading';
    content: string;
    num?: string;
  }[] = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      blocks.push({ type: 'paragraph', content: '' });
      continue;
    }

    if (trimmed.startsWith('###')) {
      blocks.push({ type: 'heading', content: trimmed.replace(/^###\s*/, '') });
    } else if (trimmed.startsWith('✓') || trimmed.startsWith('✔')) {
      blocks.push({ type: 'check', content: trimmed.replace(/^[✓✔]\s*/, '') });
    } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      blocks.push({ type: 'bullet', content: trimmed.replace(/^[•\-\*]\s*/, '') });
    } else {
      const matchNum = trimmed.match(/^(\d+)[\.\)]\s*(.*)$/);
      if (matchNum) {
        blocks.push({ type: 'numbered', num: matchNum[1], content: matchNum[2] });
      } else {
        blocks.push({ type: 'paragraph', content: trimmed });
      }
    }
  }

  const hasCustomTextColor = className.includes('text-');
  const baseColorClass = hasCustomTextColor ? '' : 'text-[#4E5667]';

  return (
    <div className={`space-y-2 ${baseColorClass} ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          return (
            <h4
              key={idx}
              className="text-sm font-bold text-[#8C6B3A] pt-2 mb-1 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#9B7846]" />
              <span>{renderInlineTokens(block.content)}</span>
            </h4>
          );
        }

        if (block.type === 'check') {
          return (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm py-0.5">
              <span className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </span>
              <div className="flex-1 leading-relaxed">{renderInlineTokens(block.content)}</div>
            </div>
          );
        }

        if (block.type === 'bullet') {
          return (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9B7846] shrink-0 mt-2" />
              <div className="flex-1 leading-relaxed">{renderInlineTokens(block.content)}</div>
            </div>
          );
        }

        if (block.type === 'numbered') {
          return (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm py-0.5">
              <span className="w-5 h-5 rounded-full bg-[#F4EFE6] text-[#8C6B3A] border border-[#DDD5C5] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                {block.num}
              </span>
              <div className="flex-1 leading-relaxed">{renderInlineTokens(block.content)}</div>
            </div>
          );
        }

        if (block.content === '') {
          return <div key={idx} className="h-1.5" />;
        }

        return (
          <p key={idx} className="leading-relaxed text-inherit">
            {renderInlineTokens(block.content)}
          </p>
        );
      })}
    </div>
  );
};

