/* La fonction prend la catégorie sélectionnée et l'état associé*/
const handleFilterButtonClick = (selectedCategory, selectedFilters, setSelectedFilters) => {
    /* Si l'état contient déjà la catégorie, alors on la désélectionne */ 
    if (selectedFilters.includes(selectedCategory)) {
        let filters = selectedFilters.filter((el) => el !== selectedCategory);
        setSelectedFilters(filters);
    /* Sinon on la sélectionne */
    } else {
        setSelectedFilters([...selectedFilters, selectedCategory]);
    }
};

export { handleFilterButtonClick };