import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { User } from '../types/User';

// const GAMERS: Gamer[] = [
//   {
//     name: 'Haley',
//     avatarUrl:
//       'https://cdn.discordapp.com/attachments/753646519093297285/907908604605136906/Haley_weeb.png',
//     playing: false,
//     selected: false,
//   },
//   {
//     name: 'Zach',
//     avatarUrl:
//       'https://cdn.discordapp.com/attachments/753646519093297285/907887326544400404/Zach_weeb.png',
//     playing: false,
//     selected: false,
//   },
//   {
//     name: 'Compton',
//     avatarUrl:
//       'https://cdn.discordapp.com/attachments/753646519093297285/907898004177027092/Compton_weeb.png',
//     playing: false,
//     selected: false,
//   },
//   {
//     name: 'Carolyn',
//     avatarUrl:
//       'https://cdn.discordapp.com/attachments/753646519093297285/907914245033844776/IMG_2841.png',
//     playing: false,
//     selected: false,
//   },
//   {
//     name: 'Juan',
//     avatarUrl:
//       'https://cdn.discordapp.com/attachments/753646519093297285/907896093487005746/Juan_weeb.png',
//     playing: false,
//     selected: false,
//   },
//   {
//     name: 'Sam',
//     avatarUrl:
//       'https://cdn.discordapp.com/attachments/753646519093297285/907890009972039680/Sam_weeb.png',
//     playing: false,
//     selected: false,
//   },
//   {
//     name: 'Nimi',
//     avatarUrl:
//       'https://cdn.discordapp.com/attachments/753646519093297285/907887351999627324/IMG_2837.jpg',
//     playing: false,
//     selected: false,
//   },
//   {
//     name: 'Tweek',
//     avatarUrl:
//       'https://cdn.discordapp.com/attachments/753646519093297285/907900409144827904/Tweek_weeb.png',
//     playing: false,
//     selected: false,
//   },
//   {
//     name: 'Gingie',
//     avatarUrl:
//       'https://cdn.discordapp.com/attachments/753646519093297285/907905657020235796/Gingie_weeb.png',
//     playing: false,
//     selected: false,
//   },
//   {
//     name: 'Sarah',
//     avatarUrl:
//       'https://cdn.discordapp.com/attachments/753646519093297285/907903797685280788/Sarah_Weeb.png',
//     playing: false,
//     selected: false,
//   },
// ];

interface UsersContextOpts {
  users: User[];
  setUsers: Dispatch<SetStateAction<never[]>>;
}

const usersContextOpts: UsersContextOpts = {
  users: [],
  setUsers: () => {},
};

export const UsersContext = createContext(usersContextOpts);

// @ts-ignore
export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    try {
      const fetchUsers = async () => {
        const response = await fetch('/api/users', { method: 'GET' }).then(
          (res) => res.json()
        );

        setUsers(response.users);
      };

      fetchUsers();
    } catch (error) {
      console.error('Error fetching users from server', error);
      throw error;
    }
  }, []);

  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
};
