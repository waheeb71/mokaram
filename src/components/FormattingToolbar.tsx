import React from 'react';
import { Bold, List, CheckSquare, Tag, Heading, Eye, Edit3 } from 'lucide-react';
import { FormattedContent } from './FormattedContent.tsx';

interface FormattingToolbarProps {
  textareaId?: string;
  value: string;
  onChange: (newValue: string) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  lang?: 'ar' | 'en';
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  textareaId,
  value,
  onChange,
  showPreview,
  onTogglePreview,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';

  const insertToken = (prefix: string, suffix: string = '', defaultText: string = '') => {
    let textarea: HTMLTextAreaElement | null = null;
    if (textareaId) {
      textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    }

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end) || defaultText;
      const replacement = `${prefix}${selected}${suffix}`;
      const updated = value.substring(0, start) + replacement + value.substring(end);
      onChange(updated);

      setTimeout(() => {
        textarea?.focus();
        textarea?.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      }, 50);
    } else {
      // Fallback if textarea not focused
      const updated = value ? `${value}\n${prefix}${defaultText}${suffix}` : `${prefix}${defaultText}${suffix}`;
      onChange(updated);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 bg-[#F2EDE2] border border-[#DDD5C5] rounded-t-lg text-xs">
      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => insertToken('• ', '', isAr ? 'نقطة مواصفات أو ميزة' : 'Feature item')}
          className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-[#FAF7F2] text-[#15181F] border border-[#DDD5C5] rounded hover:border-[#9B7846] transition-colors font-medium shadow-2xs"
          title={isAr ? 'إدراج نقطة مواصفات (•)' : 'Insert bullet item'}
        >
          <List className="w-3.5 h-3.5 text-[#9B7846]" />
          <span>{isAr ? 'نقطة •' : 'Bullet'}</span>
        </button>

        <button
          type="button"
          onClick={() => insertToken('✓ ', '', isAr ? 'ضمان أو ميزة معتمدة' : 'Verified highlight')}
          className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-[#FAF7F2] text-[#15181F] border border-[#DDD5C5] rounded hover:border-emerald-600 transition-colors font-medium shadow-2xs"
          title={isAr ? 'إدراج علامة صح وميزة معتمدة (✓)' : 'Insert checkmark highlight'}
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isAr ? 'ميزة ✓' : 'Check'}</span>
        </button>

        <button
          type="button"
          onClick={() => insertToken('**', '**', isAr ? 'نص عريض بارز' : 'Bold text')}
          className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-[#FAF7F2] text-[#15181F] border border-[#DDD5C5] rounded hover:border-[#9B7846] transition-colors font-bold shadow-2xs"
          title={isAr ? 'نص عريض (**نص**)' : 'Bold (**text**)'}
        >
          <Bold className="w-3.5 h-3.5 text-[#8C6B3A]" />
          <span>B</span>
        </button>

        <button
          type="button"
          onClick={() => insertToken('[', ']', isAr ? 'شارة مميزة' : 'Badge')}
          className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-[#FAF7F2] text-[#15181F] border border-[#DDD5C5] rounded hover:border-[#9B7846] transition-colors font-medium shadow-2xs"
          title={isAr ? 'شارة أو وسام ([شارة])' : 'Badge tag ([tag])'}
        >
          <Tag className="w-3.5 h-3.5 text-[#8C6B3A]" />
          <span>{isAr ? '[شارة]' : '[Tag]'}</span>
        </button>

        <button
          type="button"
          onClick={() => insertToken('### ', '', isAr ? 'عنوان فرعي' : 'Subtitle')}
          className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-[#FAF7F2] text-[#15181F] border border-[#DDD5C5] rounded hover:border-[#9B7846] transition-colors font-medium shadow-2xs"
          title={isAr ? 'عنوان فرعي (### عنوان)' : 'Subheading (### Heading)'}
        >
          <Heading className="w-3.5 h-3.5 text-[#8C6B3A]" />
          <span>{isAr ? 'عنوان' : 'H3'}</span>
        </button>
      </div>

      {/* Toggle Preview Button */}
      <button
        type="button"
        onClick={onTogglePreview}
        className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors font-semibold shadow-2xs ${
          showPreview
            ? 'bg-[#9B7846] text-white'
            : 'bg-white hover:bg-[#FAF7F2] text-[#7A5B2E] border border-[#DDD5C5]'
        }`}
      >
        {showPreview ? (
          <>
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isAr ? 'العودة للكتابة' : 'Edit Text'}</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5 text-[#9B7846]" />
            <span>{isAr ? 'معاينة التنسيق' : 'Live Preview'}</span>
          </>
        )}
      </button>
    </div>
  );
};

