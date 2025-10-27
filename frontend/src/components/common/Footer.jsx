// src/components/common/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="text-center text-gray-600 text-sm">
          <p>Exchange Rate Service &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Data sourced from European Central Bank</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer