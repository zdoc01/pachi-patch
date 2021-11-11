import { createContext, useState } from 'react';

export interface Gamer {
    name: string;
    avatarUrl: string;
    playing: boolean;
    selected: boolean;
}

const GAMERS: Gamer[] = [
    { name: "Haley", avatarUrl: "https://cdn.discordapp.com/attachments/753646519093297285/907908604605136906/Haley_weeb.png", playing: false, selected: false },
    { name: "Zach", avatarUrl: "https://cdn.discordapp.com/attachments/753646519093297285/907887326544400404/Zach_weeb.png", playing: false, selected: false },
    { name: "Compton", avatarUrl: "https://cdn.discordapp.com/attachments/753646519093297285/907898004177027092/Compton_weeb.png", playing: false, selected: false },
    { name: "Carolyn", avatarUrl: "https://cdn.discordapp.com/attachments/753646519093297285/907914245033844776/IMG_2841.png", playing: false, selected: false },
    { name: "Juan", avatarUrl: "https://cdn.discordapp.com/attachments/753646519093297285/907896093487005746/Juan_weeb.png", playing: false, selected: false },
    { name: "Sam", avatarUrl: "https://cdn.discordapp.com/attachments/753646519093297285/907890009972039680/Sam_weeb.png", playing: false, selected: false },
    { name: "Nimi", avatarUrl: "https://cdn.discordapp.com/attachments/753646519093297285/907887351999627324/IMG_2837.jpg", playing: false, selected: false },
    { name: "Tweek", avatarUrl: "https://cdn.discordapp.com/attachments/753646519093297285/907900409144827904/Tweek_weeb.png", playing: false, selected: false },
    { name: "Gingie", avatarUrl: "https://cdn.discordapp.com/attachments/753646519093297285/907905657020235796/Gingie_weeb.png", playing: false, selected: false },
    { name: "Sarah", avatarUrl: "https://cdn.discordapp.com/attachments/753646519093297285/907903797685280788/Sarah_Weeb.png", playing: false, selected: false }
];

interface GamersContextOpts {
    gamers: Gamer[];
    setGamers: (gamers: Gamer[]) => void;
}

const gamersContextOpts: GamersContextOpts = {
    gamers: [],
    setGamers: () => {}
};

const GamersContext = createContext(gamersContextOpts);

// @ts-ignore
export const GamersProvider = ({ children }) => {
    const [gamers, setGamers] = useState(GAMERS);

    return (
        <GamersContext.Provider value={{ gamers, setGamers }}>
            {children}
        </GamersContext.Provider>
    );
}
  
export default GamersContext;