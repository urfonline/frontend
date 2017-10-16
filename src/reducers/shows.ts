const initalState = {
  shows: {},
};

export default function ShowsReducer(state = initalState, action: { type: string }) {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
