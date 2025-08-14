import Script from 'next/script'

export default function AdminScriptPage() {
  return (
    <div style={{ display: 'none' }}>
      <Script
        src="/admin-enhancements.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Admin enhancements script loaded')
        }}
      />
    </div>
  )
}
