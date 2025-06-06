import "./Home.css"

import NavigationBar from "../components/NavigationBar.js"
import SearchRoute from "../components/SearchRoute.js"
import ContentLayout from "../components/ContentLayout.js"

function Home() {
    return (
        <ContentLayout>
            <NavigationBar />
            <SearchRoute />
        </ContentLayout>
    );
};

export default Home;