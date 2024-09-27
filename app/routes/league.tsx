import { Form } from "@remix-run/react";

export default function league() {
  return (
    <div className="flex items-center  justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-6 text-center">Ligaerstellung</h1>

        <Form className="flex flex-col gap-4" id="contact-form" method="post">
          <div className="flex items-center gap-4">
            <span className="text-right text-lg w-48">Liganame:</span>
            <input
              name="liganame"
              placeholder="Liganame"
              type="text"
              className="p-2 border border-gray-300 rounded flex-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-right text-lg w-48">Anzahl der Teams:</span>
            <input
              name="teamanzahl"
              placeholder="Teamanzahl"
              type="text"
              className="p-2 border border-gray-300 rounded flex-grow-0"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-right text-lg w-48">
              Anzahl der Spieltage:
            </span>
            <input
              name="spieltaganzahl"
              placeholder="Spieltaganzahl"
              type="number"
              className="p-2 border border-gray-300 rounded flex-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-right text-lg w-48">Anzahl der Felder:</span>
            <input
              name="felderanzahl"
              placeholder="Felderanzahl"
              type="number"
              className="p-2 border border-gray-300 rounded flex-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-right text-lg w-48">Geschlecht:</span>
            <input
              name="geschlecht"
              placeholder="Geschlecht"
              type="text"
              className="p-2 border border-gray-300 rounded flex-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-right text-lg w-48">Adresse:</span>
            <input
              name="adresse"
              placeholder="Adresse"
              type="text"
              className="p-2 border border-gray-300 rounded flex-auto"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Abbruch
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Speichern
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
