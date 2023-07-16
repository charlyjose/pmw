'use client'

import React from "react";
import "./styles.css";

const USERS_URL = "https://api.instantwebtools.net/v1/passenger";

export function Table() {
  const size = 10;
  const [users, setUsers] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const getUsers = React.useCallback(async () => {
    setIsLoading(true);
    const res = fetch(`${USERS_URL}?page=${page}&size=${size}`).then((res) =>
      res.json()
    );
    const json = await res;
    setIsLoading(false);
    setUsers(json.data);
    setCount(json.totalPassengers);
  }, [page]);

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Number of trips</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="table-data">{user._id}</td>
              <td className="table-data">{user.name}</td>
              <td className="table-data">{user.trips}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <section className="footer">
        <button onClick={() => setPage(0)} disabled={isLoading || page === 0}>
          first
        </button>
        <button
          onClick={() => setPage(page - 1)}
          disabled={isLoading || page === 0}
        >
          previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={isLoading || users.length < size}
        >
          next
        </button>
        <button
          onClick={() => setPage(Math.round(count / size) - 1)}
          disabled={isLoading || users.length < size}
        >
          last
        </button>
      </section>
    </div>
  );
}
