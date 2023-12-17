const jsonData = {
  "nodes": [
    { "id": "John", "size": 15, "label": "John", "color": "#FF0000" },
    { "id": "Mary", "size": 15, "label": "Mary", "color": "#FF0000" },
    { "id": "Suzan", "size": 15, "label": "Suzan", "color": "#FF0000" },
    { "id": "Nantes", "size": 15, "label": "Nantes", "color": "#0000FF" },
    { "id": "New-York", "size": 15, "label": "New-York", "color": "#0000FF" },
    { "id": "Sushis", "size": 7, "label": "Sushis", "color": "#00FF00" },
    { "id": "Falafels", "size": 7, "label": "Falafels", "color": "#00FF00" },
    { "id": "Kouign Amann", "size": 7, "label": "Kouign Amann", "color": "#00FF00" }
  ],
  "edges": [
    { "source": "John", "target": "Mary", "type": "line", "label": "works with", "size": 5 },
    { "source": "Mary", "target": "Suzan", "type": "line", "label": "works with", "size": 5 },
    { "source": "Mary", "target": "Nantes", "type": "arrow", "label": "lives in", "size": 5 },
    { "source": "John", "target": "New-York", "type": "arrow", "label": "lives in", "size": 5 },
    { "source": "Suzan", "target": "New-York", "type": "arrow", "label": "lives in", "size": 5 },
    { "source": "John", "target": "Falafels", "type": "arrow", "label": "eats", "size": 5 },
    { "source": "Mary", "target": "Sushis", "type": "arrow", "label": "eats", "size": 5 },
    { "source": "Suzan", "target": "Kouign Amann", "type": "arrow", "label": "eats", "size": 5 }
  ]
}

export default jsonData;