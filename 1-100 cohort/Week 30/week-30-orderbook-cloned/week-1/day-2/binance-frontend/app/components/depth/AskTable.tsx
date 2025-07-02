
export const AskTable = ({ asks }: { asks: [string, string][] }) => {
    let currentTotal = 0;
    const relevantAsks = asks.slice(0, 15);
    /*
     * 129.93 10
     * 129.94 5
     * 132.96 3
     * 132.97 253.03 
     */
    relevantAsks.reverse();
    /*
     * 132.97 253.03     270
     * 132.96 3    18
     * 129.94 5    15
     * 129.93 10   10
     */

    let asksWithTotal: [string, string, number][] = [];
    for (let i = relevantAsks.length - 1; i>=0; i--)  {
        const [price, quantity] = relevantAsks[i];
        asksWithTotal.push([price, quantity, currentTotal += Number(quantity)]);
    }
    const maxTotal = relevantAsks.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);

     /*
     *    129.93 10   10

     * 129.94 5    15
     * 132.96 3    18
     * 132.97 253.03     270
     */
    asksWithTotal.reverse();
         /*
         * 132.97 253.03     270
         * 132.96 3    18
         * * 129.94 5    15
     *    129.93 10   10

     */

    return <div>
        {asksWithTotal.map(([price, quantity, total]) => <Ask maxTotal={maxTotal} key={price} price={price} quantity={quantity} total={total} />)}
    </div>
}








function Ask({price, quantity, total, maxTotal}: {price: string, quantity: string, total: number, maxTotal: number}) {
    return <div
    style={{
        display: "flex",
        position: "relative",
        width: "100%",
        backgroundColor: "transparent",
        overflow: "hidden",
    }}
>
    <div
        style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${(100 * total) / maxTotal}%`,
        height: "100%",
        background: "rgba(228, 75, 68, 0.325)",
        transition: "width 0.3s ease-in-out",
        }}
    ></div>
    <div className="flex justify-between text-xs w-full">
        <div>
            {price}
        </div>
        <div>
            {quantity}
        </div>
        <div>
            {total?.toFixed(2)}
        </div>
    </div>
    </div>
}