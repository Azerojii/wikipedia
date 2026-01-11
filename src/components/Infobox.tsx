interface InfoboxProps {
  data: {
    [key: string]: string
  }
  title: string
}

export default function Infobox({ data, title }: InfoboxProps) {
  return (
    <div className="bg-wiki-bg border border-gray-300 rounded p-4 mb-4 text-sm">
      <h3 className="text-center font-bold text-lg mb-3 pb-2 border-b border-gray-300">
        {title}
      </h3>
      <table className="w-full">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-200 last:border-0">
              <td className="font-semibold py-2 pr-2 align-top capitalize">
                {key.replace(/_/g, ' ')}
              </td>
              <td className="py-2">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
