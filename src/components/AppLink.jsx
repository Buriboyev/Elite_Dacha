export function AppLink({ navigate, onClick, to, ...props }) {
  const handleClick = (event) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      !navigate ||
      !to ||
      !to.startsWith("/") ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(to);
  };

  return <a href={to} onClick={handleClick} {...props} />;
}
