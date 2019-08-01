import React from 'react';
import UserLayout from "../../hoc/user-layout";
import CustomButton from "../utils/custom_button";

const Dashboard = () => {
    return (
        <UserLayout>
            <div>
                <div className="user_nfo_panel">
                    <h1>User information</h1>
                    <div>
                        <span>First name</span>
                        <span>Last name</span>
                        <span>Email</span>
                    </div>
                    <CustomButton
                        type="default"
                        title="Edit account info"
                        linkTo="/user/user-profile"
                    />
                </div>

                <div className="user_nfo_panel">
                    <h1>History purchases</h1>
                    <div className="user_product_block_wrapper">
                        History
                    </div>
                </div>

            </div>
        </UserLayout>
    );
};

export default Dashboard;