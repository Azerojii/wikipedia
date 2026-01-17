interface InfoboxSection {
  title?: string
  items: {
    label: string
    value: string
    isDate?: boolean
    isLink?: boolean
  }[]
}

interface InfoboxProps {
  title: string
  image?: {
    src: string
    caption: string
  }
  headerColor?: string
  sections: InfoboxSection[]
}

export default function Infobox({ 
  title, 
  image, 
  headerColor = '#8b7355',
  sections 
}: InfoboxProps) {
  return (
    <div className="w-full bg-[#f9f9f9] border border-[#a2a9b1] text-sm float-right ml-4 mb-4 clear-right" 
         style={{ maxWidth: '280px' }}>
      {/* Header */}
      <div 
        className="text-white font-bold text-center py-2 px-3"
        style={{ backgroundColor: headerColor }}
      >
        {title}
      </div>

      {/* Image Section */}
      {image && (
        <div className="bg-white p-2">
          <img 
            src={image.src} 
            alt={title}
            className="w-full h-auto"
          />
          {image.caption && (
            <p className="text-xs italic text-gray-600 text-center mt-1 px-1">
              {image.caption}
            </p>
          )}
        </div>
      )}

      {/* Sections */}
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="bg-[#f8f9fa]">
          {section.title && (
            <div className="bg-[#eaecf0] text-gray-800 font-semibold px-3 py-1.5 text-center">
              {section.title}
            </div>
          )}
          <table className="w-full border-collapse">
            <tbody>
              {section.items.map((item, itemIdx) => (
                <tr key={itemIdx} className="border-t border-[#a2a9b1] first:border-t-0">
                  <td className="py-1.5 px-3 align-top text-gray-700 font-medium" 
                      style={{ width: '35%' }}>
                    {item.label}
                  </td>
                  <td className="py-1.5 px-3 align-top">
                    {item.isDate ? (
                      <span className="text-[#0645ad]">{item.value}</span>
                    ) : item.isLink ? (
                      <span className="text-[#0645ad] cursor-pointer hover:underline">
                        {item.value}
                      </span>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
