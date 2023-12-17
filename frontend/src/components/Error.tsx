
const Error = ({children}  : { children : string | null}) => {
    console.log(children)
  return (
    <div className = 'w-full mt-3 border bg-red-300 border-red-600 rounded-md'>
    <p className="text-center uppercase">{children}</p>
    </div>
  )
}

export default Error