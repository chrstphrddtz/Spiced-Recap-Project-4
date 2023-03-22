import { Form } from "./Component/Form/Form";
import { List } from "./Component/List/List";
import { useState, useEffect } from "react";
import { uid } from "uid";
import useLocalStorageState from "use-local-storage-state";

import "./App.css";

function App() {
  const [activities, setActivities] = useLocalStorageState("activities", {
    defaultValue: [],
  });

  const [weather, setWeather] = useState();
  const [emoji, setEmoji] = useState();
  const [temp, setTemp] = useState();

  function handleAddActivity(newActivity) {
    setActivities([...activities, { id: uid(), ...newActivity }]);
  }


  const goodWeatherActivity = activities.filter((activity) => {
    return weather ? activity.isForGoodWeather : !activity.isForGoodWeather;
  });

  useEffect(() => {
    const interval = setInterval(loadWeather, 5000);
    loadWeather();
    return () => clearInterval(interval);
  }, [weather]);

  async function loadWeather() {
    try {
      const response = await fetch(
        `https://example-apis.vercel.app/api/weather/arctic`
      );
      const data = await response.json();
      setWeather(data.isGoodWeather);
      setEmoji(data.condition);
      setTemp(data.temperature);

      console.log(data);
    } catch (error) {}
  }

  return (
    <main className="section__main">
      <List
        activities={goodWeatherActivity}
        isGoodWeather={weather}
        emoji={emoji}
        temp={temp}
      />
      <Form onAddActivity={handleAddActivity} />
    </main>
  );
}

export default App;
