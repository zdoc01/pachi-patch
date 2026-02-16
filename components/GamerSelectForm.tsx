import { useState, useMemo, ChangeEvent } from 'react';

import Button from './Button';
import GamerCard from './GamerCard';

import { GameNight } from '../types/GameNight';
import { User } from '../types/User';

import styles from '../styles/GamerSelectForm.module.css';

interface GamerSelectFormProps {
  gameNightId?: GameNight['id'];
  initialSelectedUserIds?: User['id'][];
  onSubmit: (selectedUserIds: User['id'][]) => void;
  selectionType?: 'single' | 'multi';
  users?: User[];
}

interface SelectableUser extends User {
  isSelected?: boolean;
}

const GamerSelectForm = ({
  onSubmit,
  initialSelectedUserIds = [],
  selectionType = 'multi',
  users = [],
}: GamerSelectFormProps) => {
  // Store ONLY the IDs of selected users
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelectedUserIds)
  );

  // Derive the full user objects for the UI (Computed State)
  const displayUsers: SelectableUser[] = useMemo(() => {
    return users.map((user) => ({
      ...user,
      isSelected: selectedIds.has(user.id),
    }));
  }, [users, selectedIds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedIds.size ? Array.from(selectedIds) : []);
  };

  const handleCheckboxChange =
    (user: User) => (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (e?.target?.checked) {
          next.add(user.id);
        } else {
          next.delete(user.id);
        }
        return next;
      });
    };

  /**
   * Only show loading state for initial data load (i.e. isLoading = true).
   * Otherwise, we'll pre-render what's cached and update when the revalidation
   * completes.
   */
  return (
    <form className={styles['gamer-select-form']} onSubmit={handleSubmit}>
      <div className={`flex-grid ${styles.gamers}`}>
        {displayUsers.map((user, idx) => {
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
        <Button color="primary" label={'Leggo'} type="submit" />
      </div>
    </form>
  );
};

export default GamerSelectForm;
