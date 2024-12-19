import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { addCard, editCard, deleteCard, moveCard } from "../store/slice/boardSlice";
import { Button, Modal, Input, Form, Select, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { toast, Toaster } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import moment from "moment";
import "tailwindcss/tailwind.css";

const App: React.FC = () => {
    const lists = useSelector((state: RootState) => state.board.lists);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [categories, setCategories] = useState<string[]>(["Work", "Personal", "Urgent"]);
    const [searchTerm, setSearchTerm] = useState<string>(""); 
    const [form] = Form.useForm();

    const filteredLists = lists.map((list) => ({
        ...list,
        cards: list.cards.filter(
            (card) =>
                card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                card.description.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    }));

    const isOverdue = (dueDate: string | undefined) => {
        if (!dueDate) return false;
        const dueDateObj = moment(dueDate, "YYYY-MM-DD");
        return dueDateObj.isBefore(moment(), "day");
    };

    const handleAddCard = (listId: number) => {
        setSelectedListId(listId);
        setIsModalOpen(true);
        setIsEditMode(false);
    };

    const handleEditCard = (listId: number, cardId: number) => {
        const list = lists.find((list) => list.id === listId);
        const card = list?.cards.find((card) => card.id === cardId);

        if (card) {
            setSelectedListId(listId);
            setSelectedCardId(cardId);
            setIsModalOpen(true);
            setIsEditMode(true);
            form.setFieldsValue({
                title: card.title,
                description: card.description,
                categories: card.categories,
                dueDate: card.dueDate ? moment(card.dueDate, "YYYY-MM-DD") : null,
            });
        }
    };

    const handleSubmit = (values: { title: string; description: string; categories: string[]; dueDate?: moment.Moment }) => {
        if (selectedListId !== null) {
            const newCard = {
                id: Date.now(),
                title: values.title,
                description: values.description,
                categories: values.categories,
                dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : undefined,
            };

            if (isEditMode && selectedCardId !== null) {
                dispatch(editCard({
                    listId: selectedListId,
                    cardId: selectedCardId,
                    cardData: newCard,
                }));
            } else {
                dispatch(addCard({
                    listId: selectedListId,
                    card: newCard,
                }));
            }

            toast.success(isEditMode ? "Card updated successfully!" : "Card added successfully!");
        }
        setIsModalOpen(false);
        setSelectedCardId(null);
        form.resetFields();
    };

    const handleOnDragEnd = (result: any) => {
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceListId = parseInt(source.droppableId, 10);
        const destinationListId = parseInt(destination.droppableId, 10);

        const sourceList = lists.find((list) => list.id === sourceListId);
        const card = sourceList?.cards[source.index];

        if (card) {
            dispatch(
                moveCard({
                    sourceListId,
                    targetListId: destinationListId,
                    cardId: card.id,
                })
            );
        }
    };



    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>

            {/* Search Input */}
            <Input
                placeholder="Search by title or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6"
            />

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <div className="flex gap-4">
                    {filteredLists.map((list) => (
                        <Droppable key={list.id} droppableId={String(list.id)}>
                            {(provided) => (
                                <div
                                    className="bg-white rounded-lg shadow-md p-4 w-80 flex flex-col"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2 className="text-xl font-semibold mb-4">{list.title}</h2>
                                    <div className="flex-grow">
                                        {list.cards.map((card, index) => (
                                            <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                                                {(provided) => (
                                                    <div
                                                        className={`bg-blue-100 rounded p-3 mb-2 shadow-sm flex justify-between items-center ${isOverdue(card.dueDate) ? 'bg-red-100 border border-red-500' : ''}`}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div>
                                                            <h3 className="font-semibold">{card.title}</h3>
                                                            <p className="text-sm text-gray-600">{card.description}</p>
                                                            <div>
                                                                {card.dueDate && (
                                                                    <div className="text-xs text-gray-600">
                                                                        Due: {moment(card.dueDate).format("MMM D, YYYY")}
                                                                    </div>
                                                                )}
                                                                <span className="font-medium">Categories: </span>
                                                                {card.categories.map((category) => (
                                                                    <span key={category} className="text-xs text-blue-600 bg-blue-100 p-1 rounded mx-1">
                                                                        {category}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button type="text" onClick={() => handleEditCard(list.id, card.id)}>
                                                                Edit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                    <Button type="primary" className="mt-4" icon={<PlusOutlined />} onClick={() => handleAddCard(list.id)}>
                                        Add Card
                                    </Button>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <Modal title={isEditMode ? "Edit Card" : "Add New Card"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item
                        name="title"
                        rules={[{ required: true, message: "Please input the title!" }]}
                    >
                        <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        rules={[{ required: true, message: "Please input the description!" }]}
                    >
                        <Input.TextArea placeholder="Description" />
                    </Form.Item>
                    <Form.Item name="categories">
                        <Select
                            mode="multiple"
                            placeholder="Select Categories"
                            options={categories.map((category) => ({ label: category, value: category }))}
                        />
                    </Form.Item>
                    <Form.Item name="dueDate" label="Due Date">
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditMode ? "Save Changes" : "Add"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Toaster */}
            <Toaster />
        </div>
    );
};

export default App;
