import React, { useState, useEffect, useContext } from 'react';
import ProfileLogo from "../assets/ProfileLogo.png";
import { PortfolioContext } from './Provider'; 
import './styles/ProfileCard.css'

const ProfileCard = () => {
    const { totalInvestedAmount, totalCurrentAmount } = useContext(PortfolioContext);

    const [bankDeets, setBankDeets] = useState({
        name: '',
        bankName: '',
        bankAccNum: '',
        ifscCode: '',
        dematId: '',
        invested: '',
        valuation: '',
        wallet: ''
    });

    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const response = await fetch('http://localhost:8080/profile');
                const dataArr = await response.json();
                const data = dataArr[0];

                // Update state with the fetched data
                setBankDeets({
                    name: data.name,
                    bankName: data.bankName,
                    bankAccNum: data.bankAccountNo,
                    ifscCode: data.ifscCode,
                    dematId: data.dematId,
                    invested: `₹${totalInvestedAmount.toFixed(2)}`, // Use context value
                    valuation: `₹${totalCurrentAmount}`, // Use context value
                    wallet: `₹${data.withdrawableMargin}`
                });

            } catch (error) {
                console.error('Failed to fetch bank details:', error);
            }
        };

        fetchBankDetails();
    }, [totalInvestedAmount, totalCurrentAmount]); // Re-fetch data when context values change

    const handleCopyClick = () => {
        const details = `
            Name: ${bankDeets.name}
            Bank: ${bankDeets.bankName}
            Bank Acc Num: ${bankDeets.bankAccNum}
            IFSC Code: ${bankDeets.ifscCode}
            Demat ID: ${bankDeets.dematId}
            Invested: ${bankDeets.invested}
            Valuation: ${bankDeets.valuation}
            Wallet: ${bankDeets.wallet}
        `;

        navigator.clipboard.writeText(details).then(() => {
            alert('Details copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <img src={ProfileLogo} alt="Avatar" height={200} width={200} />
                        <p id="profilecardname">Welcome Mr.{bankDeets.name}</p>
                    </div>
                    <div className="flip-card-back">
                        <table className="details-table">
                            <tbody>
                            <tr>
                                <td><strong>Bank:</strong></td>
                                <td>{bankDeets.bankName}</td>
                            </tr>
                            <tr>
                                <td><strong>Bank Acc Num:</strong></td>
                                <td>{bankDeets.bankAccNum}</td>
                            </tr>
                            <tr>
                                <td><strong>IFSC Code:</strong></td>
                                <td>{bankDeets.ifscCode}</td>
                            </tr>
                            <tr>
                                <td><strong>Demat ID:</strong></td>
                                <td>{bankDeets.dematId}</td>
                            </tr>
                            <tr>
                                <td><strong>Invested:</strong></td>
                                <td>{bankDeets.invested}</td>
                            </tr>
                            <tr>
                                <td><strong>Valuation:</strong></td>
                                <td>{bankDeets.valuation}</td>
                            </tr>
                            <tr>
                                <td><strong>Wallet:</strong></td>
                                <td>{bankDeets.wallet}</td>
                            </tr>
                            </tbody>
                        </table>
                        <button onClick={handleCopyClick}>Copy to Clipboard!</button>
                        </div>
                </div>
            </div>
    );
};

export default ProfileCard;


