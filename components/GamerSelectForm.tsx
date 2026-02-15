import { useState, FormEvent, useEffect } from 'react';

import Button from './Button';
import GamerCard from './GamerCard';

import { useGameSessions } from '../hooks/use-game-sessions';
import { useUsers } from '../hooks/use-users';

import { IconCog } from '../src/icons/IconCog';

import { GameNight } from '../types/GameNight';
import { User } from '../types/User';

import styles from '../styles/GamerSelectForm.module.css';

interface GamerSelectFormProps {
  gameNightId?: GameNight['id'];
  onSubmit: (selectedUserIds: User['id'][]) => void;
  selectionType?: 'single' | 'multi';
  users?: User[];
}

interface SelectableUser extends User {
  isSelected?: boolean;
}

const GamerSelectForm = ({
  gameNightId,
  onSubmit,
  selectionType = 'multi',
  users = [],
}: GamerSelectFormProps) => {
  const { users: usersToDisplay, isLoading: isLoadingUsers } = useUsers({
    defaultUsers: users,
    skipFetch: !!users?.length,
  });

  const { gameSessions, isLoading: isLoadingGameSessions } =
    useGameSessions(gameNightId);

  const [allUsers, setAllUsers] = useState(
    usersToDisplay.map((user) => ({
      ...user,
      isSelected: gameSessions?.some((gs) => gs.userId === user.id) || false,
    })) as SelectableUser[]
  );

  const isLoading = isLoadingUsers || isLoadingGameSessions;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const selectedUserIds = Array.from(formData.values()) as User['id'][];
    onSubmit(selectedUserIds);
  };

  const handleCheckboxChange = (user: SelectableUser) => () => {
    // Must update in this way (full reset of `allUsers`) to force full checkbox
    // re-render, otherwise checkbox state doesn't reflect user selected
    // state.
    const updatedUsers = allUsers.map((u) => {
      if (u.id !== user.id) {
        return u;
      }
      return { ...u, isSelected: !u.isSelected };
    });
    setAllUsers(updatedUsers);
  };

  /**
   * Only show loading state for initial data load (i.e. isLoading = true).
   * Otherwise, we'll pre-render what's cached and update when the revalidation
   * completes.
   */
  return isLoading ? (
    <div className="flex-grid">
      <IconCog classes={['spin']} />
    </div>
  ) : (
    <form className={styles['gamer-select-form']} onSubmit={handleSubmit}>
      <div className={`flex-grid ${styles.gamers}`}>
        {allUsers.map((user, idx) => {
          return (
            <label className={styles['selectable-gamer-card']} key={user.id}>
              <input
                checked={user.isSelected}
                name={
                  selectionType === 'single' ? 'gamer' : `gamer-checkbox-${idx}`
                }
                type={selectionType === 'single' ? 'radio' : 'checkbox'}
                value={user.id}
                onChange={handleCheckboxChange(user)}
              />
              <GamerCard classes={styles['gamer-card']} gamer={user} />
            </label>
          );
        })}
      </div>
      <div className={styles.actions}>
        <Button
          color="secondary"
          label={'Cancel'}
          onClick={(event) => onSubmit([])}
        />
        <Button
          disabled={isLoadingGameSessions}
          color="primary"
          label={'Leggo'}
          loading={isLoadingGameSessions}
          type="submit"
        />
      </div>
    </form>
  );
};

export default GamerSelectForm;
