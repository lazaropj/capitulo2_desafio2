import { Component, useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export function Dashboard(FoodData){
  
  const [foods, setFoods] = useState([]);
  const [modalOpen, setModalOpen] = useState();
  const [editModalOpen, setEditModalOpen] = useState();
  const [editingFood, setEditingFood] = useState();

  useEffect(() => {
    async function  loadFoods(){
      const response = await api.get('/foods');
      setFoods(response.data)
    }
    loadFoods()
    
  },[])

  const handleAddFood = async food => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async food => {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods({ foods: foodsUpdated })
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async id => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods({foods: foodsFiltered})
  }

  const toggleModal = () => {
    setModalOpen({ modalOpen: !modalOpen });
  }

  const toggleEditModal = () => {
    setEditModalOpen({ editModalOpen: !editModalOpen });
  }

  const handleEditFood = food => {
    setEditModalOpen({ editingFood: food, editModalOpen: true });
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
  
}


