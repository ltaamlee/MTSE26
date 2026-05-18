import {message, notification, Table} from 'antd';
import { useEffect, useState } from 'react';
import { getUserApi } from '../util/api';

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserApi();
            if (!res?.message) {
                setDataSource(res)
            } else {
                notification.error({
                    message: "Error",
                    description: res.message,
                });
            }
        }
        fetchUser();
    }, [])
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title:'Role',
            dataIndex: "role",
        }
    ]
    return (
        <div style={{padding: "30px"}}>
            <Table dataSource={dataSource} columns={columns} rowKey="id" />
        </div>
    );
}

export default UserPage;