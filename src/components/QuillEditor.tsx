'use client'

import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded h-64 flex items-center justify-center text-gray-400">
      Chargement de l&apos;éditeur...
    </div>
  ),
})

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ align: [] }],
    ['clean'],
  ],
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'blockquote', 'code-block',
  'link', 'image',
  'align',
]

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
  return (
    <div className="quill-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Commencez à écrire votre article ici...'}
        style={{ minHeight: '400px' }}
      />
      <style jsx global>{`
        .quill-wrapper .ql-container {
          font-size: 16px;
          font-family: Georgia, 'Times New Roman', serif;
          min-height: 400px;
        }
        .quill-wrapper .ql-editor {
          min-height: 400px;
          line-height: 1.7;
        }
        .quill-wrapper .ql-toolbar {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          border-color: #d1d5db;
          background: #f9fafb;
        }
        .quill-wrapper .ql-container {
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          border-color: #d1d5db;
        }
        .quill-wrapper .ql-editor h2 {
          font-size: 1.5rem;
          font-weight: bold;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.25rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .quill-wrapper .ql-editor h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .quill-wrapper .ql-editor blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          font-style: italic;
          color: #4b5563;
        }
      `}</style>
    </div>
  )
}
