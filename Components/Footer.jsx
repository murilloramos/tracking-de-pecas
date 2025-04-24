import { Fot1, Fot2 } from "../Components/index"

export default () => {
  const footerNavs = [
    {
      href: "#",
      name: "",
    },
    {
      href: "#",
      name: "",
    },
    {
      href: "#",
      name: "",
    },
    {
      href: "#",
      name: "",
    },
  ]
  return (
    <footer className="pt-10">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
        <div className="justify-between sm:flex">
          <div className="space-y-6">
            <img src="https://sjsp.org.br/wp-content/uploads/2023/05/faculdade-esamc-ins-log-g-3.png" className="w-32" />
            <p className="max-w-md">
              
            </p>
            <ul className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
              {footerNavs.map((item, idx) => (
                <li className="text-gray-8-- hover:text-gray-500 duration-150">
                  <a key={idx} href={item.href}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <p className="text-gray-700 font-semibold"></p>
            <div className="flex items-center gap-3 mt-3 sm:block">
            </div>
          </div>
        </div>
        <div className="mt-10 py-10 border-t md:text-center">
          <p>ESAMC</p>
        </div>
      </div>
    </footer>
  )
}