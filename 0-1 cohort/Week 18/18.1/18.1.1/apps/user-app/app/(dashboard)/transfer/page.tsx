import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getBalance() {
  const session = await getServerSession(authOptions);
  // by default code
  /*
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
    */
  const userId = session?.user?.id;
  if (userId) {
    const balance = await prisma.balance.findFirst({
      where: {
        userId: Number(userId),
      },
    });
    return {
      amount: balance?.amount || 0,
      locked: balance?.locked || 0,
    };
  } else {
    // Handle the case where userId is missing
    console.error("User ID is missing in the session.");
    return {
      amount: 0,
      locked: 0,
    };
  }
}

async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  //default code
  /*
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
        */
  // new code start
  if (session?.user?.id) {
    const txns = await prisma.onRampTransaction.findMany({
      where: {
        userId: Number(userId),
      },
    });
    return txns.map((t) => ({
      time: t.startTime,
      amount: t.amount,
      status: t.status,
      provider: t.provider,
    }));
  } else {
    // Handle the case where userId is missing
    console.error("User ID is missing in the session.");
    return [];
  }
  // new code ends
}

export default async function () {
  const balance = await getBalance();
  const transactions = await getOnRampTransactions();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <AddMoney />
        </div>
        <div>
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          <div className="pt-4">
            <OnRampTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}

