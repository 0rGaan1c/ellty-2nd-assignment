interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-3 py-2 rounded font-medium focus:outline-none cursor-pointer";

  const variantStyles = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100",
    success: "bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
