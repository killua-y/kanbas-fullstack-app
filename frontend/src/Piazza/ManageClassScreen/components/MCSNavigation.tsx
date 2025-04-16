// MCSNavigation.tsx
import { useParams, useLocation, Link } from 'react-router-dom';
import "./MCSNavigation.css"

export default function MCSNavigation() {
    const params = useParams();
    const location = useLocation();
    const courseId = params.cid;

    const links = [
        'General Settings',
        'Customize Q&A',
        'Manage Folders',
        'Manage Enrollments',
        'Create Groups',
        'Customize Course Page',
        'Piazza Network Settings'
    ];

    // URL格式化函数
    const formatPath = (label: string) => {
        return label
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9-]/g, '');
    };

    return (
        <nav className="mcs-horizontal-nav">
            <div className="nav-container">
                {links.map((link) => {
                    const path = `/Kambaz/Courses/${courseId}/Piazza/manage/${formatPath(link)}`;
                    const isActive = location.pathname === path;

                    return (
                        <Link
                            key={link}
                            to={path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            {link}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}