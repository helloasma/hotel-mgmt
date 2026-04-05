export default function Sprig({ className, variant = "full" }) {
  return (
    <svg className={className} viewBox="0 0 200 400">
      <line x1="100" y1="400" x2="100" y2="40" className="sprig-line-main"/>
      <line x1="65"  y1="400" x2="65"  y2="80" className="sprig-line"/>
      <line x1="135" y1="400" x2="135" y2="72" className="sprig-line"/>

      <ellipse cx="100" cy="25" rx="13" ry="28" className="sprig-top"/>
      <ellipse cx="65" cy="65" rx="10" ry="22" className="sprig-top-light"/>
      <ellipse cx="135" cy="58" rx="10" ry="22" className="sprig-top"/>

      <ellipse cx="82" cy="180" rx="15" ry="5" className="sprig-leaf-left"/>
      <ellipse cx="118" cy="180" rx="15" ry="5" className="sprig-leaf-right"/>

      {/* Only render extra leaves if variant = full */}
      {variant === "full" && (
        <>
          <ellipse cx="82" cy="240" rx="15" ry="5" className="sprig-leaf-left-soft"/>
          <ellipse cx="118" cy="240" rx="15" ry="5" className="sprig-leaf-right-soft"/>
        </>
      )}
    </svg>
  );
}