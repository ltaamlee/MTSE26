import { CrownFilled } from "@ant-design/icons";
import { Result } from "antd";

const HomePage = () => {
    return (
        <div style={{padding: "20px"}}>
            <Result
                icon={<CrownFilled style={{ color: "#1890ff" }} />}
                title="Welcome to the Home Page!"
                subTitle="This is the main page of the application. You can navigate to other pages from here." 
            />
        </div>
    );
}

export default HomePage;