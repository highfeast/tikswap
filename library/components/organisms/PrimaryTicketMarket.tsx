"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import AvatarButton from "../atoms/AvatarButton";
import Button from "../atoms/Button";
import Card from "../molecules/Card";

interface Avatar {
  src: string;
  name: string;
  person: "boy" | "girl";
}

const avatars: Avatar[] = [
  {
    src: "https://avatar.iran.liara.run/public/boy?username=Scott",
    name: "Scott",
    person: "boy",
  },
  {
    src: "https://avatar.iran.liara.run/public/girl?username=Maria",
    name: "Maria",
    person: "girl",
  },
  {
    src: "https://avatar.iran.liara.run/public/girl?username=Jade",
    name: "Jade",
    person: "girl",
  },
  {
    src: "https://avatar.iran.liara.run/public/girl?username=Klee",
    name: "Klee",
    person: "girl",
  },
  {
    src: "https://avatar.iran.liara.run/public/boy?username=Russo",
    name: "Russo",
    person: "boy",
  },
  {
    src: "https://avatar.iran.liara.run/public/boy?username=Nevin",
    name: "Nevin",
    person: "boy",
  },
];

interface CardProps {
  component: any;
  props: Record<string, any>;
  id: number;
}

const PrimaryTicketMarket = () => {
  const CARD_OFFSET = 10;
  const SCALE_FACTOR = 0.06;
  const [cards, setCards] = useState<CardProps[]>([
    {
      component: SelectAvatar,
      props: { handleSelection, flip },
      id: 1,
    },
    {
      component: ListTicketOnMarket,
      props: { flip },
      id: 3,
    },
    {
      component: PurchaseTicket,
      props: { flip },
      id: 2,
    },
  ]);

  function flip() {
    setCards((prevCards) => {
      const newArray = [...prevCards];
      newArray.unshift(newArray.pop()!);
      return newArray;
    });
  }

  function handleSelection(name: string) {
    console.log(`Selected avatar: ${name}`);
  }

  return (
    <div className="flex flex-col h-full p-4 overflow-scroll min-w-fit gap-4">
      <p className=" font-outfit font-semibold w-full">Primary Ticket Market</p>
      <div className="flex flex-col h-full gap-8">
        <Card className="min-w-80 w-fit text-[#625F48]">
          <p className=" font-outfit font-semibold">Hint</p>
          <p className="max-w-prose text-sm">
            Choose an avatar to represent a ticket buyer and proceed with
            purchasing the ticket. You will resell the ticket on the secondary
            market due to the avatar being unable to attend the event later on.
          </p>
        </Card>

        <div className="relative h-full">
          {cards.map(({ component: CardComponent, props, id }, index) => (
            <motion.div
              key={id}
              style={{
                transformOrigin: "top center",
                top: index * -CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR,
                zIndex: cards.length - index,
              }}
              animate={{
                top: index * -CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR,
                zIndex: cards.length - index,
              }}
              className="absolute h-full"
            >
              <CardComponent {...props} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrimaryTicketMarket;

interface SelectAvatarProps {
  handleSelection: (name: string) => void;
  flip: () => void;
}

interface GeneralCardProps {
  flip: () => void;
}

const SelectAvatar = ({ handleSelection, flip }: SelectAvatarProps) => (
  <Card className="h-full min-w-fit w-[364px] justify-between rounded-3xl">
    <div className="grid grid-cols-3 gap-4">
      {avatars.map((avatar) => (
        <AvatarButton
          key={avatar.name}
          src={avatar.src}
          handleClick={() => handleSelection(avatar.name)}
        />
      ))}
    </div>
    <Button
      className="font-medium"
      text={"Choose An Avatar"}
      handleClick={flip}
    />
  </Card>
);

const PurchaseTicket = ({ flip }: GeneralCardProps) => (
  <Card className="h-full min-w-fit w-[364px] justify-between rounded-3xl">
    <div className="flex items-center justify-center h-44 rounded-lg text-white bg-[linear-gradient(to_bottom_right,#06b6d4,#10b981)]">
      <p className="text-2xl font-bold font-atyp">Your Cool Ticket</p>
    </div>
    <Button
      className="font-medium"
      text={"Purchase Ticket"}
      handleClick={flip}
    />
  </Card>
);

const ListTicketOnMarket = ({ flip }: GeneralCardProps) => (
  <Card className="h-full min-w-fit w-[364px] justify-between rounded-3xl">
    <div className="flex items-center justify-center h-44 rounded-lg text-white bg-[linear-gradient(to_bottom_right,#06b6d4,#10b981)]">
      <p className="text-2xl font-bold font-atyp">Your Cool Ticket</p>
    </div>
    <Button className="font-medium" text={"List Ticket"} handleClick={flip} />
  </Card>
);
