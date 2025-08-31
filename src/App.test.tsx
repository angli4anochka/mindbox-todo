import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Тесты приложения', () => {
  test('отображает заголовок', () => {
    render(<App />);
    const titleElement = screen.getByText(/Задачи/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('добавляет новую задачу', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Что нужно сделать?/i);
    
    await userEvent.type(input, 'Новая задача');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(screen.getByText('Новая задача')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('переключает статус выполнения', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Что нужно сделать?/i);
    
    await userEvent.type(input, 'Тестовая задача');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    const checkbox = screen.getAllByRole('checkbox')[0];
    expect(checkbox).not.toBeChecked();
    
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('удаляет задачу', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Что нужно сделать?/i);
    
    await userEvent.type(input, 'Задача для удаления');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(screen.getByText('Задача для удаления')).toBeInTheDocument();
    
    const deleteButton = screen.getByText('×');
    await userEvent.click(deleteButton);
    
    expect(screen.queryByText('Задача для удаления')).not.toBeInTheDocument();
  });

  test('фильтрует задачи по статусу', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Что нужно сделать?/i);
    
    await userEvent.type(input, 'Активная задача');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    await userEvent.type(input, 'Выполненная задача');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    const completedCheckbox = screen.getAllByRole('checkbox')[1];
    await userEvent.click(completedCheckbox);
    
    const activeFilter = screen.getByText('Активные');
    await userEvent.click(activeFilter);
    expect(screen.getByText('Активная задача')).toBeInTheDocument();
    expect(screen.queryByText('Выполненная задача')).not.toBeInTheDocument();
    
    const completedFilter = screen.getByText('Выполненные');
    await userEvent.click(completedFilter);
    expect(screen.queryByText('Активная задача')).not.toBeInTheDocument();
    expect(screen.getByText('Выполненная задача')).toBeInTheDocument();
    
    const allFilter = screen.getByText('Все');
    await userEvent.click(allFilter);
    expect(screen.getByText('Активная задача')).toBeInTheDocument();
    expect(screen.getByText('Выполненная задача')).toBeInTheDocument();
  });

  test('показывает количество активных задач', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Что нужно сделать?/i);
    
    expect(screen.getByText('Осталось: 0')).toBeInTheDocument();
    
    await userEvent.type(input, 'Задача 1');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(screen.getByText('Осталось: 1')).toBeInTheDocument();
    
    await userEvent.type(input, 'Задача 2');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(screen.getByText('Осталось: 2')).toBeInTheDocument();
    
    const checkbox1 = screen.getAllByRole('checkbox')[0];
    await userEvent.click(checkbox1);
    expect(screen.getByText('Осталось: 1')).toBeInTheDocument();
  });

  test('очищает выполненные задачи', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Что нужно сделать?/i);
    
    await userEvent.type(input, 'Задача 1');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    await userEvent.type(input, 'Задача 2');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    await userEvent.type(input, 'Задача 3');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    const checkboxes = screen.getAllByRole('checkbox');
    const checkbox1 = checkboxes[0];
    const checkbox2 = checkboxes[1];
    
    await userEvent.click(checkbox1);
    await userEvent.click(checkbox2);
    
    const clearButton = screen.getByText('Очистить выполненные');
    await userEvent.click(clearButton);
    
    expect(screen.queryByText('Задача 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Задача 2')).not.toBeInTheDocument();
    expect(screen.getByText('Задача 3')).toBeInTheDocument();
  });

  test('не добавляет пустые задачи', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Что нужно сделать?/i);
    
    await userEvent.type(input, '   ');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(screen.getByText('Нет задач')).toBeInTheDocument();
  });
});