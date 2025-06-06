import "./ContentLayout.css"

function ContentLayout ( {children}) {
    return (
        <div className="content">
            {children}
        </div>
    );
}

export default ContentLayout;