function PageHeader({ title, description, icon }) {
  return (
    <div className="mb-4 p-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
      <h2 className="fw-bold"><i className={`bi ${icon} me-2`}></i>{title}</h2>
      <p className="text-muted small mb-0">{description}</p>
    </div>
  );
}
export default PageHeader;