import { Card } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';

export const RevenueCard = ({
    title,
    orderCount,
    amount
}) => {
    const [count, setCount] = useState(0);

    return <Card>
        <button onClick={() => {
            setCount(count + 1);
            setTimeout(() => {
                console.log(count)
            }, 1000)
        }}></button>
        </Card>
}
// storybook
// mui
// respnsive sidebar
