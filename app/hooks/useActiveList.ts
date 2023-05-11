//a custom hook called useActiveList that uses the create function from the zustand library to create a store for managing a list of active members.
import { create } from "zustand";

// The store has three methods: add, remove, and set, which respectively add a member to the list, remove a member from the list, and set the entire list of members.
interface ActiveListStore {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

// The members property is an array of strings representing the current list of active members.
// The set method replaces the entire list of members with a new list, while add and remove modify the list by appending or removing a single member.
const useActiveList = create<ActiveListStore>((set) => ({
  members: [],
  add: (id) => set((state) => ({ members: [...state.members, id] })),
  remove: (id) =>
    set((state) => ({
      members: state.members.filter((memberId) => memberId !== id),
    })),
  set: (ids) => set({ members: ids }),
}));

export default useActiveList;
