/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, Flex, Heading, Table } from "@chakra-ui/react";
import { useOpenModal } from "../hooks/useOpenModal";
import { useGetUserByIdQuery, useGetUsersQuery } from "../services/userApi";
import Page from "./Page";
import UserFormModal from "./UserFormModal";

const initialData = {
  name: "",
  email: "",
};

export default function UserRagisterContainer() {
  const fetchUser = (id: number) =>
    useGetUserByIdQuery(id, {
      skip: id === null,
    });

  const {
    data,
    handleOpen,
    isOpen,
    setIsOpen,
    setSelectedId,
    isLoading: isGetByIdLoading,
  } = useOpenModal(initialData, fetchUser);

  console.log(isGetByIdLoading);

  const { data: users, isLoading, isFetching } = useGetUsersQuery();

  let content = null;

  if (users && users.length > 0) {
    content = (
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.id}</Table.Cell>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>
              <Button
                size="sm"
                onClick={() => handleOpen(user.id)}
                colorScheme="blue"
              >
                Edit
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    );
  } else {
    content = (
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={4}>No users found.</Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  console.log(users);

  return (
    <Page isLoading={isGetByIdLoading || isFetching || isLoading}>
      <Box maxW="6xl" mx="auto" px={6} py={8}>
        {/* Header Section */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">User</Heading>
          <Button colorScheme="blue" onClick={() => handleOpen()}>
            Add User
          </Button>
        </Flex>

        {/* User Table Section using Chakra UI 3.19+ Table.Root */}
        <Box
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          overflowX="auto"
        >
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Role</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            {content}
          </Table.Root>
        </Box>
      </Box>

      {isOpen && !isGetByIdLoading && (
        <UserFormModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedId(null);
          }}
          initialData={data}
        />
      )}
    </Page>
  );
}
