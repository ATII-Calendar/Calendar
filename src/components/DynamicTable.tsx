import  React, { useState } from 'react';

export default function DynamicTable() {
  let [message, setMessage] = useState("");
  let [items, setItems] = useState<string[]>([]);

  function updateMessage(event: any) {
    setMessage(event.target.value);
  }

  function handleClick() {
    let _items = [...items];
    _items.push(message);

    setItems(_items);
  }

  function handleItemChanged(i: number, event: any) {
    let _items = items;
    _items[i]  = event.target.value;

    setItems(_items);
  }

  function handleItemDeleted(i: number) {
    let _items = items;

    _items.splice(i, 1);

    setItems(items);
  }

  function renderRows() {
    return (
      <div>
        {
          items.map((o: any, i: any) => {
            return (
              <tr key={"item-" + i}>
                <td>
                  <input
                    type="text"
                    value={o}
                    onChange={(e: any) => handleItemChanged(i, e)}
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleItemDeleted(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })
        }
      </div>
    );
  }

  return (
    <div>
      <table className="">
        <thead>
          <tr>
            <th>
              Item
            </th>
            <th>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {renderRows()}
        </tbody>
      </table>
      <hr/>
      <input
        type="text"
        value={message}
        onChange={updateMessage}
      />
      <button
        onClick={handleClick}
      >
        Add Item
      </button>
    </div>
  );
}
