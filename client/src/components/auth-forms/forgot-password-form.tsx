return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          control={form.control}
          rules={{ required: true }}
        />
        <Button type="submit">Send Reset Link</Button>
      </form>
    </Form>
  );